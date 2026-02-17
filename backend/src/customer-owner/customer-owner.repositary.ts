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
      const customerUser = await this.prisma.user.findUnique({
        where: { mobileNumber: dto.mobileNumber, role: 'CUSTOMER' },
        include: {
          customerSetting: true,
        },
      });

      if (!customerUser) {
        throw new NotFoundException(
          'Customer not found with this mobile number',
        );
      }

      if (!customerUser.customerSetting) {
        throw new NotFoundException(
          'Customer setting not found for this mobile number',
        );
      }

      const activeRelationWithAnotherOwner =
        await this.prisma.customerOwner.findFirst({
          where: {
            customerId: customerUser.customerSetting.id,
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
          customerId: customerUser.customerSetting.id,
          ownerId: dto.ownerId,
          ...(dto.isActivated !== undefined && {
            isActivated: dto.isActivated,
          }),
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
}
