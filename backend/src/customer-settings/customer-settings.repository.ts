import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DailyMilkStatus, ExtraMilkSlot } from '../../generated/prisma/enums.js';

@Injectable()
export class CustomerSettingsRepository {
  constructor(private prisma: PrismaService) {}

  async getCustomerProfile(customerOwnerId: number): Promise<any> {
    try {
      const customerOwner = await this.prisma.customerOwner.findUnique({
        where: { id: customerOwnerId },
        include: {
          customer: {
            include: {
              user: true,
            },
          },
          vacationSchedules: true,
        },
      });

      if (!customerOwner) {
        throw new NotFoundException(
          `Customer-owner relation not found with id: ${customerOwnerId}`,
        );
      }

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const isPaused = customerOwner.vacationSchedules.some((vacation) => {
        const startDate = new Date(vacation.startDate);
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(vacation.endDate);
        endDate.setUTCHours(0, 0, 0, 0);

        return today >= startDate && today <= endDate;
      });

      return {
        id: customerOwner.id,
        name: customerOwner.customer.user.fullName,
        phone: customerOwner.customer.user.mobileNumber,
        email: customerOwner.customer.user.email,
        address: customerOwner.customer.user.address,
        morningCowQty: Number(customerOwner.customer.morningCowQty),
        morningBuffaloQty: Number(customerOwner.customer.morningBuffaloQty),
        eveningCowQty: Number(customerOwner.customer.eveningCowQty),
        eveningBuffaloQty: Number(customerOwner.customer.eveningBuffaloQty),
        status: isPaused ? 'paused' : 'active',
        avatar: customerOwner.customer.user.profileImageUrl,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while fetching customer profile',
          error: error.message,
        });
      }

      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async getCustomerDeliveryHistory(
    customerOwnerId: number,
    params: {
      page: number;
      limit: number;
      status?: string;
      slot?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<any> {
    try {
      const customerOwner = await this.prisma.customerOwner.findUnique({
        where: { id: customerOwnerId },
      });

      if (!customerOwner) {
        throw new NotFoundException(
          `Customer-owner relation not found with id: ${customerOwnerId}`,
        );
      }

      const safePage = Number.isFinite(params.page)
        ? Math.max(1, Math.floor(params.page))
        : 1;
      const safeLimit = Number.isFinite(params.limit)
        ? Math.min(200, Math.max(1, Math.floor(params.limit)))
        : 200;

      const statusInput = params.status?.toUpperCase();
      const slotInput = params.slot?.toUpperCase();
      const status =
        statusInput === 'PENDING' ||
        statusInput === 'DELIVERED' ||
        statusInput === 'CANCELLED'
          ? statusInput
          : undefined;
      const slot =
        slotInput === 'MORNING' || slotInput === 'EVENING'
          ? slotInput
          : undefined;

      const startDate = params.startDate ? new Date(params.startDate) : null;
      const endDate = params.endDate ? new Date(params.endDate) : null;

      const baseWhere = {
        customerOwnerId,
        ...(slot
          ? {
              slot: slot as ExtraMilkSlot,
            }
          : {}),
        ...(startDate || endDate
          ? {
              deliveryDate: {
                ...(startDate ? { gte: startDate } : {}),
                ...(endDate ? { lte: endDate } : {}),
              },
            }
          : {}),
      };

      const where = {
        ...baseWhere,
        ...(status
          ? {
              status: status as DailyMilkStatus,
            }
          : {}),
      };

      const totalItems = await this.prisma.dailyMilk.count({
        where,
      });
      const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
      const offset = (safePage - 1) * safeLimit;

      const history = await this.prisma.dailyMilk.findMany({
        where,
        orderBy: [{ deliveryDate: 'desc' }, { slot: 'asc' }],
        take: safeLimit,
        skip: offset,
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

      const statusCounts = await this.prisma.dailyMilk.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: { status: true },
      });

      const counts = {
        delivered:
          statusCounts.find((item) => item.status === 'DELIVERED')?._count
            .status ?? 0,
        pending:
          statusCounts.find((item) => item.status === 'PENDING')?._count
            .status ?? 0,
        cancelled:
          statusCounts.find((item) => item.status === 'CANCELLED')?._count
            .status ?? 0,
      };

      return {
        page: safePage,
        totalPages,
        totalItems,
        statusCounts: counts,
        deliveries: history.map((item) => ({
          id: item.id,
          date: item.deliveryDate.toISOString().slice(0, 10),
          shift: item.slot.toLowerCase(),
          cowQty: Number(item.cowQty),
          buffaloQty: Number(item.buffaloQty),
          totalAmount: Number(item.totalAmount),
          status: item.status.toLowerCase(),
          name: item.customerOwner.customer.user.fullName,
          profileImageUrl: item.customerOwner.customer.user.profileImageUrl,
          notes: item.notes,
        })),
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while fetching customer delivery history',
          error: error.message,
        });
      }

      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
