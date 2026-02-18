import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExtraMilkOrderDto } from './dto/create-extra-milk-order.dto.js';

@Injectable()
export class ExtraMilkOrderRepository {
  constructor(private prisma: PrismaService) {}

  async createExtraMilkOrder(dto: CreateExtraMilkOrderDto): Promise<any> {
    try {
      const customerOwner = await this.prisma.customerOwner.findUnique({
        where: { id: dto.customerOwnerId },
      });

      if (!customerOwner) {
        throw new NotFoundException(
          `Customer-owner relation not found with id: ${dto.customerOwnerId}`,
        );
      }

      if (!customerOwner.isActivated) {
        throw new BadRequestException(
          'Customer-owner relation is not active. Please activate first.',
        );
      }

      const cowQty = Number(dto.cowQty ?? 0);
      const buffaloQty = Number(dto.buffaloQty ?? 0);

      // Keep date-only semantics (YYYY-MM-DD) without local timezone shift.
      const [year, month, day] = dto.deliveryDate.split('-').map(Number);
      const deliveryDate = new Date(Date.UTC(year, month - 1, day));

      return await this.prisma.extraMilkOrder.create({
        data: {
          customerOwnerId: customerOwner.id,
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
}
