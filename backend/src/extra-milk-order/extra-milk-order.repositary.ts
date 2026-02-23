import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CreateExtraMilkOrderDto } from './dto/create-extra-milk-order.dto.js';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ExtraMilkOrderRepository {
  constructor(private prisma: PrismaService) {}

  async createExtraMilkOrder(dto: CreateExtraMilkOrderDto): Promise<any> {
    try {
      const cowQty = Number(dto.cowQty ?? 0);
      const buffaloQty = Number(dto.buffaloQty ?? 0);

      // Keep date-only semantics (YYYY-MM-DD) without local timezone shift.
      const [year, month, day] = dto.deliveryDate.split('-').map(Number);
      const deliveryDate = new Date(Date.UTC(year, month - 1, day));

      return await this.prisma.extraMilkOrder.create({
        data: {
          customerOwnerId: dto.customerOwnerId,
          deliveryDate,
          slot: dto.slot === 'evening' ? 'EVENING' : 'MORNING',
          cowQty,
          buffaloQty,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'Extra milk request already exists for this date and slot.',
        );
      }

      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while creating extra milk order',
          error: error.message,
        });
      }

      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async findUpcomingByCustomerOwnerId(params: {
    customerOwnerId: number;
    today: Date;
    take?: number;
  }) {
    const { customerOwnerId, today, take = 10 } = params;
    return this.prisma.extraMilkOrder.findMany({
      where: {
        customerOwnerId,
        deliveryDate: {
          gte: today,
        },
      },
      orderBy: [{ deliveryDate: 'asc' }, { slot: 'asc' }],
      take,
    });
  }

  async findByCustomerOwnerIdsAndDateSlot(params: {
    customerOwnerIds: number[];
    deliveryDate: Date;
    slot: 'MORNING' | 'EVENING';
  }) {
    const { customerOwnerIds, deliveryDate, slot } = params;
    return this.prisma.extraMilkOrder.findMany({
      where: {
        customerOwnerId: { in: customerOwnerIds },
        deliveryDate,
        slot,
      },
    });
  }
}
