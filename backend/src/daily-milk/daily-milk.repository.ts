import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DailyMilkRepository {
  constructor(private prisma: PrismaService) {}

  async getActiveCustomerOwners() {
    return this.prisma.customerOwner.findMany({
      where: { isActivated: true },
      include: {
        customer: true,
        owner: true,
      },
    });
  }

  async getExtrasAndVacations(params: {
    customerOwnerIds: number[];
    deliveryDate: Date;
    slot: 'MORNING' | 'EVENING';
  }) {
    const { customerOwnerIds, deliveryDate, slot } = params;

    return this.prisma.$transaction([
      this.prisma.extraMilkOrder.findMany({
        where: {
          customerOwnerId: { in: customerOwnerIds },
          deliveryDate,
          slot,
        },
      }),
      this.prisma.vacationSchedule.findMany({
        where: {
          customerOwnerId: { in: customerOwnerIds },
          startDate: { lte: deliveryDate },
          endDate: { gte: deliveryDate },
        },
      }),
    ]);
  }

  async upsertDailyMilkEntries(
    entries: Array<{
      customerOwnerId: number;
      deliveryDate: Date;
      slot: 'MORNING' | 'EVENING';
      cowQty: number;
      buffaloQty: number;
      cowPrice: number;
      buffaloPrice: number;
      totalAmount: number;
      notes: string | null;
    }>,
  ) {
    const upserts = entries.map((entry) =>
      this.prisma.dailyMilk.upsert({
        where: {
          customerOwnerId_deliveryDate_slot: {
            customerOwnerId: entry.customerOwnerId,
            deliveryDate: entry.deliveryDate,
            slot: entry.slot,
          },
        },
        create: {
          customerOwnerId: entry.customerOwnerId,
          deliveryDate: entry.deliveryDate,
          slot: entry.slot,
          cowQty: entry.cowQty,
          buffaloQty: entry.buffaloQty,
          cowPrice: entry.cowPrice,
          buffaloPrice: entry.buffaloPrice,
          totalAmount: entry.totalAmount,
          notes: entry.notes,
        },
        update: {
          cowQty: entry.cowQty,
          buffaloQty: entry.buffaloQty,
          cowPrice: entry.cowPrice,
          buffaloPrice: entry.buffaloPrice,
          totalAmount: entry.totalAmount,
          notes: entry.notes,
        },
      }),
    );

    await this.prisma.$transaction(upserts);
  }

  async getDailyMilkWithCustomer(dailyMilkId: number) {
    return this.prisma.dailyMilk.findUnique({
      where: { id: dailyMilkId },
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
  }

  async updateDailyMilk(params: {
    dailyMilkId: number;
    cowQty: number;
    buffaloQty: number;
    notes: string | null;
    status: 'PENDING' | 'DELIVERED' | 'CANCELLED';
    totalAmount: number;
  }) {
    const { dailyMilkId, cowQty, buffaloQty, notes, status, totalAmount } =
      params;

    return this.prisma.dailyMilk.update({
      where: { id: dailyMilkId },
      data: {
        cowQty,
        buffaloQty,
        notes,
        status,
        totalAmount,
        source: 'MANUAL',
      },
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
  }

  async getOwnerDashboard(
    ownerId: number,
    params: {
      deliveryDate: Date;
      page: number;
      limit: number;
      search?: string;
      slot?: 'MORNING' | 'EVENING';
    },
  ) {
    const { deliveryDate, page, limit, search, slot } = params;

    const where: Prisma.DailyMilkWhereInput = {
      deliveryDate,
      ...(slot ? { slot } : {}),
      customerOwner: {
        ownerId,
        ...(search
          ? {
              customer: {
                user: {
                  fullName: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            }
          : {}),
      },
    };

    const totalItems = await this.prisma.dailyMilk.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const safePage = Math.min(page, totalPages);

    const dailyMilks = await this.prisma.dailyMilk.findMany({
      where,
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
      orderBy: [
        { slot: 'asc' },
        {
          id: 'asc',
        },
      ],
      skip: (safePage - 1) * limit,
      take: limit,
    });

    const deliveries = dailyMilks.map((item) => {
      const customerUser = item.customerOwner.customer.user;

      return {
        id: item.id,
        name: customerUser.fullName,
        profileImageUrl: customerUser.profileImageUrl,
        cowQty: Number(item.cowQty),
        buffaloQty: Number(item.buffaloQty),
        slot: item.slot.toLowerCase(),
        status: item.status,
        notes: item.notes,
      };
    });

    const totals = await this.prisma.dailyMilk.aggregate({
      where: {
        deliveryDate,
        customerOwner: { ownerId },
      },
      _sum: {
        cowQty: true,
        buffaloQty: true,
      },
    });

    const totalCowQty = Number(totals._sum.cowQty ?? 0);
    const totalBuffaloQty = Number(totals._sum.buffaloQty ?? 0);

    return {
      date: deliveryDate.toISOString().slice(0, 10),
      page: safePage,
      totalPages,
      totalItems,
      totalCowQty,
      totalBuffaloQty,
      totalLiters: totalCowQty + totalBuffaloQty,
      deliveries,
    };
  }

  async getOwnerDeliveryHistory(
    ownerId: number,
    params: {
      page: number;
      limit: number;
      search?: string;
      slot?: 'MORNING' | 'EVENING';
      status?: 'PENDING' | 'DELIVERED' | 'CANCELLED';
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const { page, limit, search, slot, status, startDate, endDate } = params;

    const where: Prisma.DailyMilkWhereInput = {
      ...(slot ? { slot } : {}),
      ...(status ? { status } : {}),
      ...(startDate || endDate
        ? {
            deliveryDate: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate ? { lte: endDate } : {}),
            },
          }
        : {}),
      customerOwner: {
        ownerId,
        ...(search
          ? {
              customer: {
                user: {
                  fullName: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            }
          : {}),
      },
    };

    const totalItems = await this.prisma.dailyMilk.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const safePage = Math.min(page, totalPages);

    const dailyMilks = await this.prisma.dailyMilk.findMany({
      where,
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
      orderBy: [{ deliveryDate: 'desc' }, { id: 'desc' }],
      skip: (safePage - 1) * limit,
      take: limit,
    });

    const deliveries = dailyMilks.map((item) => {
      const customerUser = item.customerOwner.customer.user;

      return {
        id: item.id,
        name: customerUser.fullName,
        profileImageUrl: customerUser.profileImageUrl,
        date: item.deliveryDate.toISOString().slice(0, 10),
        cowQty: Number(item.cowQty),
        buffaloQty: Number(item.buffaloQty),
        slot: item.slot.toLowerCase(),
        status: item.status,
        notes: item.notes,
      };
    });

    return {
      page: safePage,
      totalPages,
      totalItems,
      deliveries,
    };
  }

  async getCustomerMonthlyCalendar(customerOwnerId: number, monthDate: Date) {
    const customerOwner = await this.prisma.customerOwner.findUnique({
      where: { id: customerOwnerId },
      include: {
        customer: true,
      },
    });

    if (!customerOwner) {
      throw new NotFoundException(
        `Customer-owner relation not found with id: ${customerOwnerId}`,
      );
    }

    const year = monthDate.getUTCFullYear();
    const month = monthDate.getUTCMonth();
    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 0));

    const deliveries = await this.prisma.dailyMilk.findMany({
      where: {
        customerOwnerId,
        deliveryDate: {
          gte: start,
          lte: end,
        },
      },
      select: {
        deliveryDate: true,
        slot: true,
        cowQty: true,
        buffaloQty: true,
      },
      orderBy: [{ deliveryDate: 'asc' }, { slot: 'asc' }],
    });

    const daysInMonth = end.getUTCDate();
    const records = Array.from({ length: daysInMonth }, (_, index) => ({
      day: index + 1,
      morningCow: 0,
      morningBuffalo: 0,
      eveningCow: 0,
      eveningBuffalo: 0,
    }));

    for (const item of deliveries) {
      const day = item.deliveryDate.getUTCDate();
      const record = records[day - 1];
      if (!record) continue;

      if (item.slot === 'MORNING') {
        record.morningCow = Number(item.cowQty);
        record.morningBuffalo = Number(item.buffaloQty);
      } else {
        record.eveningCow = Number(item.cowQty);
        record.eveningBuffalo = Number(item.buffaloQty);
      }
    }

    return {
      month: start.toISOString().slice(0, 10),
      base: {
        morningCow: Number(customerOwner.customer.morningCowQty ?? 0),
        morningBuffalo: Number(customerOwner.customer.morningBuffaloQty ?? 0),
        eveningCow: Number(customerOwner.customer.eveningCowQty ?? 0),
        eveningBuffalo: Number(customerOwner.customer.eveningBuffaloQty ?? 0),
      },
      records,
    };
  }

  async getCustomerMonthlySummary(customerOwnerId: number, monthDate: Date) {
    const customerOwner = await this.prisma.customerOwner.findUnique({
      where: { id: customerOwnerId },
    });

    if (!customerOwner) {
      throw new NotFoundException(
        `Customer-owner relation not found with id: ${customerOwnerId}`,
      );
    }

    const year = monthDate.getUTCFullYear();
    const month = monthDate.getUTCMonth();
    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 0));

    const totals = await this.prisma.dailyMilk.aggregate({
      where: {
        customerOwnerId,
        deliveryDate: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        cowQty: true,
        buffaloQty: true,
        totalAmount: true,
      },
    });

    const totalCowQty = Number(totals._sum.cowQty ?? 0);
    const totalBuffaloQty = Number(totals._sum.buffaloQty ?? 0);
    const totalAmount = Number(totals._sum.totalAmount ?? 0);

    return {
      month: start.toISOString().slice(0, 10),
      totalCowQty,
      totalBuffaloQty,
      totalLiters: totalCowQty + totalBuffaloQty,
      totalAmount,
    };
  }
}
