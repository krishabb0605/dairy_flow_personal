import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class VacationScheduleRepository {
  constructor(private prisma: PrismaService) {}

  async createVacationSchedule(params: {
    customerOwnerId: number;
    startDate: Date;
    startSlot: 'MORNING' | 'EVENING';
    endDate: Date;
    endSlot: 'MORNING' | 'EVENING';
  }) {
    const { customerOwnerId, startDate, startSlot, endDate, endSlot } = params;
    return this.prisma.vacationSchedule.create({
      data: {
        customerOwnerId,
        startDate,
        startSlot,
        endDate,
        endSlot,
      },
      include: {
        customerOwner: {
          include: {
            customer: true,
            owner: true,
          },
        },
      },
    });
  }

  async findUpcomingByCustomerOwnerIds(params: {
    customerOwnerId: number;
    today: Date;
    take?: number;
  }) {
    const { customerOwnerId, today, take = 10 } = params;
    return this.prisma.vacationSchedule.findMany({
      where: {
        customerOwnerId,
        OR: [
          {
            startDate: {
              gte: today,
            },
          },
          {
            endDate: {
              gte: today,
            },
          },
        ],
      },
      orderBy: [{ startDate: 'asc' }, { startSlot: 'asc' }],
      take,
    });
  }

  async findActiveByCustomerOwnerIds(params: {
    customerOwnerIds: number[];
    deliveryDate: Date;
  }) {
    const { customerOwnerIds, deliveryDate } = params;
    return this.prisma.vacationSchedule.findMany({
      where: {
        customerOwnerId: { in: customerOwnerIds },
        startDate: { lte: deliveryDate },
        endDate: { gte: deliveryDate },
      },
    });
  }
}
