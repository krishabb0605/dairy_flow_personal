import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { InvoiceStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class InvoiceRepository {
  constructor(private prisma: PrismaService) {}

  async updateInvoice(
    invoiceId: number,
    params: {
      status?: string;
      paymentMethod?: string;
      notes?: string | null;
    },
  ) {
    const data: {
      status?: InvoiceStatus;
      paymentMethod?: PaymentMethod;
      notes?: string | null;
    } = {};

    if (typeof params.status === 'string') {
      const normalizedStatus = params.status.trim().toUpperCase();
      const allowedStatuses = new Set([
        'UNPAID',
        'PENDING_COD',
        'PAID',
        'FAILED',
      ]);
      if (!allowedStatuses.has(normalizedStatus)) {
        throw new BadRequestException('Invalid invoice status');
      }
      data.status = normalizedStatus as InvoiceStatus;
    }

    if (typeof params.paymentMethod === 'string') {
      const normalizedMethod = params.paymentMethod.trim().toUpperCase();
      const allowedMethods = new Set(['STRIPE', 'COD']);
      if (!allowedMethods.has(normalizedMethod)) {
        throw new BadRequestException('Invalid payment method');
      }
      data.paymentMethod = normalizedMethod as PaymentMethod;
      if (!data.status && normalizedMethod === 'COD') {
        data.status = 'PENDING_COD';
      }
    }

    if (params.notes !== undefined) {
      if (params.notes === null) {
        data.notes = null;
      } else {
        data.notes = params.notes.trim();
      }
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No invoice fields to update');
    }

    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data,
      select: {
        id: true,
        status: true,
        paymentMethod: true,
        notes: true,
      },
    });
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
    const safePage = Number.isFinite(params.page)
      ? Math.max(1, params.page)
      : 1;
    const safeLimit = Number.isFinite(params.limit)
      ? Math.max(1, params.limit)
      : 10;
    const normalizedSearch = params.search.trim().toLowerCase();
    const normalizedStatus = params.status.trim().toUpperCase();
    const normalizedYear = params.year.trim();
    const allowedStatuses = new Set([
      'UNPAID',
      'PENDING_COD',
      'PAID',
      'FAILED',
    ]);
    const statusFilter = allowedStatuses.has(normalizedStatus)
      ? normalizedStatus
      : 'all';

    const invoices = await this.prisma.invoice.findMany({
      where: {
        customerOwner: {
          ownerId,
        },
      },
      orderBy: [{ billYear: 'desc' }, { billMonth: 'desc' }, { id: 'desc' }],
      include: {
        customerOwner: {
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    const mappedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      billYear: invoice.billYear,
      billMonth: invoice.billMonth,
      cowMilkQtyTotal: Number(invoice.cowMilkQtyTotal),
      buffaloMilkQtyTotal: Number(invoice.buffaloMilkQtyTotal),
      totalAmount: Number(invoice.totalAmount),
      status: invoice.status,
      customerName: invoice.customerOwner.customer.user.fullName,
      customerMobile: invoice.customerOwner.customer.user.mobileNumber,
      notes: invoice.notes,
    }));

    const baseFiltered = mappedInvoices.filter((invoice) => {
      const matchesSearch =
        !normalizedSearch ||
        invoice.customerName.toLowerCase().includes(normalizedSearch) ||
        invoice.customerMobile.toLowerCase().includes(normalizedSearch) ||
        String(invoice.id).includes(normalizedSearch);

      if (!matchesSearch) return false;
      if (statusFilter !== 'all' && invoice.status !== statusFilter) {
        return false;
      }

      return true;
    });

    const availableYears = Array.from(
      new Set(baseFiltered.map((invoice) => invoice.billYear)),
    ).sort((a, b) => b - a);

    const filtered = baseFiltered.filter((invoice) => {
      if (normalizedYear === 'all') return true;
      return String(invoice.billYear) === normalizedYear;
    });

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
    const safePageNumber = Math.min(safePage, totalPages);
    const offset = (safePageNumber - 1) * safeLimit;
    const paginatedInvoices = filtered.slice(offset, offset + safeLimit);

    const totalPending = filtered.reduce(
      (sum, invoice) =>
        invoice.status === 'PAID' ? sum : sum + invoice.totalAmount,
      0,
    );
    const totalCollected = filtered.reduce(
      (sum, invoice) =>
        invoice.status === 'PAID' ? sum + invoice.totalAmount : sum,
      0,
    );
    const totalLitersDelivered = filtered.reduce(
      (sum, invoice) =>
        sum + invoice.cowMilkQtyTotal + invoice.buffaloMilkQtyTotal,
      0,
    );

    return {
      invoices: paginatedInvoices,
      page: safePageNumber,
      limit: safeLimit,
      totalPages,
      totalItems,
      totalPending,
      totalCollected,
      totalLitersDelivered,
      years: availableYears,
    };
  }

  async getCustomerBilling(
    customerOwnerId: number,
    params: {
      page: number;
      limit: number;
      status: string;
      year: string;
    },
  ) {
    const safePage = Number.isFinite(params.page)
      ? Math.max(1, params.page)
      : 1;
    const safeLimit = Number.isFinite(params.limit)
      ? Math.max(1, params.limit)
      : 10;
    const normalizedStatus = params.status.trim().toUpperCase();
    const normalizedYear = params.year.trim();
    const allowedStatuses = new Set([
      'UNPAID',
      'PENDING_COD',
      'PAID',
      'FAILED',
    ]);

    const statusFilter = allowedStatuses.has(normalizedStatus)
      ? normalizedStatus
      : 'all';

    const invoices = await this.prisma.invoice.findMany({
      where: {
        customerOwnerId,
      },
      orderBy: [{ billYear: 'desc' }, { billMonth: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        billYear: true,
        billMonth: true,
        cowMilkQtyTotal: true,
        buffaloMilkQtyTotal: true,
        totalAmount: true,
        status: true,
        paymentMethod: true,
      },
    });

    const mappedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      billYear: invoice.billYear,
      billMonth: invoice.billMonth,
      cowMilkQtyTotal: Number(invoice.cowMilkQtyTotal),
      buffaloMilkQtyTotal: Number(invoice.buffaloMilkQtyTotal),
      totalAmount: Number(invoice.totalAmount),
      status: invoice.status,
      paymentMethod: invoice.paymentMethod,
    }));

    const availableYears = Array.from(
      new Set(mappedInvoices.map((invoice) => invoice.billYear)),
    ).sort((a, b) => b - a);

    const baseFiltered = mappedInvoices.filter((invoice) => {
      if (statusFilter !== 'all' && invoice.status !== statusFilter) {
        return false;
      }
      return true;
    });

    const filtered = baseFiltered.filter((invoice) => {
      if (normalizedYear === 'all') return true;
      return String(invoice.billYear) === normalizedYear;
    });

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
    const safePageNumber = Math.min(safePage, totalPages);
    const offset = (safePageNumber - 1) * safeLimit;
    const paginatedInvoices = filtered.slice(offset, offset + safeLimit);
    const alertInvoices = filtered
      .filter((invoice) => invoice.status !== 'PAID')
      .slice(0, 2);

    return {
      invoices: paginatedInvoices,
      alertInvoices,
      page: safePageNumber,
      limit: safeLimit,
      totalPages,
      totalItems,
      years: availableYears,
    };
  }

  async getInvoiceForCustomer(customerOwnerId: number, invoiceId: number) {
    return this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        customerOwnerId,
      },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        billYear: true,
        billMonth: true,
        paymentMethod: true,
      },
    });
  }

  async setStripeSessionId(invoiceId: number, stripeSessionId: string) {
    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        stripeSessionId,
      },
      select: {
        id: true,
        stripeSessionId: true,
      },
    });
  }

  async markInvoicePaidFromStripe(params: {
    invoiceId: number;
    stripeSessionId?: string | null;
    stripePaymentIntentId?: string | null;
  }) {
    return this.prisma.invoice.update({
      where: { id: params.invoiceId },
      data: {
        status: 'PAID',
        paymentMethod: 'STRIPE',
        stripeSessionId: params.stripeSessionId ?? undefined,
        stripePaymentIntentId: params.stripePaymentIntentId ?? undefined,
        paidAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        paymentMethod: true,
      },
    });
  }

  async findByCustomerOwnerIdsAndMonth(params: {
    customerOwnerIds: number[];
    billYear: number;
    billMonth: number;
  }) {
    const { customerOwnerIds, billYear, billMonth } = params;
    if (customerOwnerIds.length === 0) return [];

    return this.prisma.invoice.findMany({
      where: {
        customerOwnerId: { in: customerOwnerIds },
        billYear,
        billMonth,
      },
      select: {
        customerOwnerId: true,
        status: true,
      },
    });
  }

  async upsertMonthlyInvoices(
    entries: Array<{
      customerOwnerId: number;
      billYear: number;
      billMonth: number;
      cowMilkQtyTotal: number;
      buffaloMilkQtyTotal: number;
      totalAmount: number;
      paymentMethod: 'STRIPE' | 'COD';
      status: 'UNPAID' | 'PENDING_COD' | 'PAID' | 'FAILED';
    }>,
  ) {
    if (entries.length === 0) return;

    const upserts = entries.map((entry) =>
      this.prisma.invoice.upsert({
        where: {
          customerOwnerId_billYear_billMonth: {
            customerOwnerId: entry.customerOwnerId,
            billYear: entry.billYear,
            billMonth: entry.billMonth,
          },
        },
        create: {
          customerOwnerId: entry.customerOwnerId,
          billYear: entry.billYear,
          billMonth: entry.billMonth,
          cowMilkQtyTotal: entry.cowMilkQtyTotal,
          buffaloMilkQtyTotal: entry.buffaloMilkQtyTotal,
          totalAmount: entry.totalAmount,
          paymentMethod: entry.paymentMethod,
          status: entry.status,
        },
        update: {
          cowMilkQtyTotal: entry.cowMilkQtyTotal,
          buffaloMilkQtyTotal: entry.buffaloMilkQtyTotal,
          totalAmount: entry.totalAmount,
        },
      }),
    );

    await this.prisma.$transaction(upserts);
  }
}
