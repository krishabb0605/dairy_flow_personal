import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class InvoiceRepository {
  constructor(private prisma: PrismaService) {}

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
      cowMilkTotal: number;
      buffaloMilkTotal: number;
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
          cowMilkTotal: entry.cowMilkTotal,
          buffaloMilkTotal: entry.buffaloMilkTotal,
          totalAmount: entry.totalAmount,
          paymentMethod: entry.paymentMethod,
          status: entry.status,
        },
        update: {
          cowMilkTotal: entry.cowMilkTotal,
          buffaloMilkTotal: entry.buffaloMilkTotal,
          totalAmount: entry.totalAmount,
        },
      }),
    );

    await this.prisma.$transaction(upserts);
  }
}
