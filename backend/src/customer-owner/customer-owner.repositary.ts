import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCustomerOwnerDto } from './dto/create-customer-owner.dto.js';

@Injectable()
export class CustomerOwnerRepository {
  constructor(private prisma: PrismaService) {}

  async createCustomerOwner(dto: CreateCustomerOwnerDto): Promise<any> {
    try {
      const ownerUser = await this.prisma.ownerSettings.findUnique({
        where: { id: dto.ownerId },
      });

      if (!ownerUser) {
        throw new NotFoundException(
          `Owner not found with this ownerId : ${dto.ownerId} `,
        );
      }

      const customerUser = await this.prisma.user.findUnique({
        where: { mobileNumber: dto.mobileNumber, role: 'CUSTOMER' },
        include: {
          customerSettings: true,
        },
      });

      if (!customerUser) {
        throw new NotFoundException(
          'Customer not found with this mobile number',
        );
      }

      if (!customerUser.customerSettings) {
        throw new NotFoundException(
          'Customer setting not found for this mobile number',
        );
      }

      const existingSameOwnerRelation =
        await this.prisma.customerOwner.findFirst({
          where: {
            customerId: customerUser.customerSettings.id,
            ownerId: dto.ownerId,
          },
          orderBy: {
            id: 'desc',
          },
        });

      if (existingSameOwnerRelation?.isActivated) {
        throw new BadRequestException('You already added this customer');
      }

      const activeRelationWithAnotherOwner =
        await this.prisma.customerOwner.findFirst({
          where: {
            customerId: customerUser.customerSettings.id,
            isActivated: true,
            ownerId: {
              not: dto.ownerId,
            },
          },
        });

      if (activeRelationWithAnotherOwner) {
        throw new BadRequestException(
          'Please tell customer to deactivate their previous activation, after that you can add customer',
        );
      }

      return await this.prisma.customerOwner.create({
        data: {
          customerId: customerUser.customerSettings.id,
          ownerId: dto.ownerId,
          isActivated: dto.isActivated || true,
        },
        include: {
          customer: true,
          owner: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while creating customer-owner relation',
          error: error.message,
        });
      }

      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async deactivateCustomerOwner(customerOwnerId: number): Promise<any> {
    try {
      const customerOwner = await this.prisma.customerOwner.findUnique({
        where: { id: customerOwnerId },
      });

      if (!customerOwner) {
        throw new NotFoundException(
          `Customer-owner relation not found with id: ${customerOwnerId}`,
        );
      }

      if (!customerOwner.isActivated) {
        return {
          message: 'Customer-owner relation is already deactivated',
          customerOwner,
        };
      }

      return await this.prisma.customerOwner.update({
        where: { id: customerOwnerId },
        data: { isActivated: false },
      });
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while deactivating customer-owner relation',
          error: error.message,
        });
      }

      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async getUpcomingCustomerActivity(customerOwnerId: number): Promise<any> {
    try {
      const customerOwner = await this.prisma.customerOwner.findUnique({
        where: { id: customerOwnerId },
      });

      if (!customerOwner) {
        throw new NotFoundException(
          `Customer-owner relation not found with id: ${customerOwnerId}`,
        );
      }

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const [extras, vacations] = await this.prisma.$transaction([
        this.prisma.extraMilkOrder.findMany({
          where: {
            customerOwnerId,
            deliveryDate: {
              gte: today,
            },
          },
          orderBy: [{ deliveryDate: 'asc' }, { slot: 'asc' }],
          take: 10,
        }),
        this.prisma.vacationSchedule.findMany({
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
          take: 10,
        }),
      ]);

      return {
        extras: extras.map((item) => ({
          id: item.id,
          deliveryDate: item.deliveryDate.toISOString().slice(0, 10),
          slot: item.slot.toLowerCase(),
          cowQty: Number(item.cowQty),
          buffaloQty: Number(item.buffaloQty),
        })),
        vacations: vacations.map((item) => ({
          id: item.id,
          startDate: item.startDate.toISOString().slice(0, 10),
          startSlot: item.startSlot.toLowerCase(),
          endDate: item.endDate?.toISOString().slice(0, 10) ?? null,
          endSlot: item.endSlot?.toLowerCase() ?? null,
        })),
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while fetching upcoming customer activity',
          error: error.message,
        });
      }

      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
