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
}
