import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import Stripe from 'stripe';

import { DailyMilkRepository } from '../daily-milk/daily-milk.repository.js';
import { InvoiceRepository } from './invoice.repository.js';

// Resolve timezone from environment variables.
const TIME_ZONE = process.env.CRON_TIMEZONE ?? process.env.TZ;
const CRON_OPTIONS = TIME_ZONE ? { timeZone: TIME_ZONE } : undefined;

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger('Invoice');
  private readonly stripe: Stripe;

  constructor(
    private dailyMilkRepository: DailyMilkRepository,
    private invoiceRepository: InvoiceRepository,
  ) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      this.logger.warn('STRIPE_SECRET_KEY is not set. Stripe is disabled.');
      return;
    }

    this.stripe = new Stripe(stripeSecret);
  }

  /**
   * Runs every day at 23:59 (11:59 PM)
   * Cron format: minute hour day month day-of-week
   *
   * This method checks if tomorrow is the 1st day of a new month.
   * If yes → generate invoices for the current month.
   */
  @Cron('59 23 * * *', CRON_OPTIONS)
  async handleMonthEndCron(): Promise<void> {
    const now = new Date();

    // Create tomorrow's date
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // If tomorrow is NOT the 1st day of month → exit
    if (tomorrow.getDate() !== 1) return;

    // Current year and month (invoice month)
    const billYear = now.getFullYear();
    const billMonth = now.getMonth() + 1; // JS months are 0-based

    await this.generateMonthlyInvoices(billYear, billMonth);
  }

  /**
   * Generate monthly invoices for all customers
   *
   * Steps:
   * 1. Get month date range
   * 2. Fetch aggregated milk totals from daily entries
   * 3. Skip customers whose invoice is already PAID
   * 4. Create or update invoice records
   */
  async generateMonthlyInvoices(
    billYear: number,
    billMonth: number,
  ): Promise<void> {
    // Get first and last date of the month
    const { startDate, endDate } = this.getMonthDateRange(billYear, billMonth);

    // Group daily milk entries into monthly totals
    const totals = await this.dailyMilkRepository.groupMonthlyTotals({
      startDate,
      endDate,
    });

    // If no data → nothing to generate
    if (totals.length === 0) return;

    // Extract all customerOwnerIds
    const customerOwnerIds = totals.map((entry) => entry.customerOwnerId);

    // Fetch existing invoices for this month
    const existing =
      await this.invoiceRepository.findByCustomerOwnerIdsAndMonth({
        customerOwnerIds,
        billYear,
        billMonth,
      });

    // Skip invoices that are already PAID
    const skipCustomerOwnerIds = new Set(
      existing
        .filter((item) => item.status === 'PAID')
        .map((item) => item.customerOwnerId),
    );

    // Prepare invoice entries for remaining customers
    const entries = totals
      .filter((entry) => !skipCustomerOwnerIds.has(entry.customerOwnerId))
      .map((entry) => ({
        customerOwnerId: entry.customerOwnerId,
        billYear,
        billMonth,
        cowMilkQtyTotal: Number(entry._sum.cowQty ?? 0),
        buffaloMilkQtyTotal: Number(entry._sum.buffaloQty ?? 0),
        totalAmount: Number(entry._sum.totalAmount ?? 0),
        paymentMethod: 'STRIPE' as const,
        status: 'UNPAID' as const,
      }));

    if (entries.length === 0) return;

    // Upsert invoices (create if not exists, update if exists)
    await this.invoiceRepository.upsertMonthlyInvoices(entries);

    this.logger.log(
      `Monthly invoices generated for ${billYear}-${String(billMonth).padStart(2, '0')}: ${entries.length}`,
    );
  }

  async getOwnerBilling(
    ownerId: number,
    params: {
      page: number;
      limit: number;
      search: string;
      status: string;
      year: string;
    },
  ) {
    return this.invoiceRepository.getOwnerBilling(ownerId, params);
  }

  async getCustomerBilling(
    customerOwnerId: number,
    params: {
      page: number;
      limit: number;
      search: string;
      status: string;
      year: string;
    },
  ) {
    return this.invoiceRepository.getCustomerBilling(customerOwnerId, params);
  }

  async createStripeCheckoutSession(
    customerOwnerId: number,
    invoiceId: number,
  ) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      throw new BadRequestException('Stripe is not configured');
    }

    const successUrl = process.env.STRIPE_CHECKOUT_SUCCESS_URL;
    const cancelUrl = process.env.STRIPE_CHECKOUT_CANCEL_URL;
    if (!successUrl || !cancelUrl) {
      throw new BadRequestException('Stripe redirect URLs are not configured');
    }

    const invoice = await this.invoiceRepository.getInvoiceForCustomer(
      customerOwnerId,
      invoiceId,
    );

    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }
    if (invoice.status === 'PAID') {
      throw new BadRequestException('Invoice is already paid');
    }

    const totalAmount = Number(invoice.totalAmount);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      throw new BadRequestException('Invalid invoice amount');
    }

    const unitAmount = Math.round(totalAmount * 100);
    const monthLabel = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(Date.UTC(invoice.billYear, invoice.billMonth - 1, 1)));

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'inr',
            unit_amount: unitAmount,
            product_data: {
              name: `Milk Invoice - ${monthLabel}`,
            },
          },
        },
      ],
      metadata: {
        invoiceId: String(invoice.id),
        customerOwnerId: String(customerOwnerId),
      },
    });

    await this.invoiceRepository.setStripeSessionId(invoice.id, session.id);

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async handleStripeWebhook(signature: string | string[], payload: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new BadRequestException('Stripe webhook secret not configured');
    }

    const sigHeader = Array.isArray(signature) ? signature[0] : signature;
    if (!sigHeader) {
      throw new BadRequestException('Missing Stripe signature');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        sigHeader,
        webhookSecret,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Invalid Stripe signature';
      throw new BadRequestException(message);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const invoiceId = session.metadata?.invoiceId;
      if (invoiceId) {
        await this.invoiceRepository.markInvoicePaidFromStripe({
          invoiceId: Number(invoiceId),
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : (session.payment_intent?.id ?? null),
        });
      }
    }

    return { received: true };
  }

  async updateInvoice(
    invoiceId: number,
    params: {
      status?: string;
      paymentMethod?: string;
      notes?: string | null;
    },
  ) {
    return this.invoiceRepository.updateInvoice(invoiceId, params);
  }

  /**
   * Returns first and last date of a given month (UTC based)
   *
   * Example:
   * billYear = 2026
   * billMonth = 2 (February)
   *
   * startDate → 2026-02-01
   * endDate → 2026-02-28
   */
  private getMonthDateRange(
    billYear: number,
    billMonth: number,
  ): {
    startDate: Date;
    endDate: Date;
  } {
    // First day of month (UTC)
    const startDate = new Date(Date.UTC(billYear, billMonth - 1, 1));

    // Last day of month (UTC)
    // Passing day = 0 gives last day of previous month
    const endDate = new Date(Date.UTC(billYear, billMonth, 0));

    return { startDate, endDate };
  }
}
