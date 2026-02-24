import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class InvoiceRepository {
  constructor(private prisma: PrismaService) {}

  async updateInvoice(
    invoiceId: number,
    params: {
      status?: string;
      notes?: string | null;
    },
  ) {
    const data: { status?: InvoiceStatus; notes?: string | null } = {};

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
