import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BasicInfoDto } from './dto/basic-info.dto.js';
import { CustomerConfigDto } from './dto/customer-config.dto.js';
import { OwnerConfigDto } from './dto/owner-config.dto.js';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async getUser(firebaseUid: string) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },

      include: {
        ownerProfile: true,

        customerProfile: {
          include: {
            owner: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    mobileNumber: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.customerProfile?.owner?.user) {
      const ownerUser = user.customerProfile.owner.user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { owner, ...customerProfileWithoutOwner } = user.customerProfile;

      return {
        ...user,
        customerProfile: {
          ...customerProfileWithoutOwner,
          ownerUser,
        },
      };
    }

    return user;
  }

  async createUser(dto: BasicInfoDto): Promise<any> {
    try {
      return await this.prisma.user.upsert({
        where: {
          firebaseUid: dto.firebaseUid,
        },
        update: {
          fullName: dto.fullName,
          mobileNumber: dto.mobileNumber,
          address: dto.address,
          email: dto.email,
          onboardingStep: 1,
        },
        create: {
          fullName: dto.fullName,
          mobileNumber: dto.mobileNumber,
          address: dto.address,
          email: dto.email,
          firebaseUid: dto.firebaseUid,
          onboardingStep: 1,
        },
      });
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while creating user',
          error: error.message,
        });
      }
    }
  }

  async updateRole(userId: number, role: 'OWNER' | 'CUSTOMER'): Promise<any> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          role,
          onboardingStep: 2,
        },
      });
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while updating user role',
          error: error.message,
        });
      }
    }
  }

  async createOwnerProfile(userId: number, dto: OwnerConfigDto): Promise<any> {
    try {
      await this.prisma.ownerProfile.create({
        data: {
          userId,
          dairyName: dto.dairyName,
          cowEnabled: dto.cowEnabled,
          cowPrice: dto.cowPrice,
          buffaloEnabled: dto.buffaloEnabled,
          buffaloPrice: dto.buffaloPrice,
        },
      });

      const userInfo = await this.finishOnboarding(userId);

      return userInfo;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while creating owner profile',
          error: error.message,
        });
      }
    }
  }

  async createCustomerProfile(
    userId: number,
    dto: CustomerConfigDto,
  ): Promise<any> {
    try {
      const invite = await this.prisma.registeredCustomer.findUnique({
        where: { customerCode: dto.customerCode },
      });

      if (!invite)
        throw new BadRequestException(
          'This customer code is not associated with any owner.',
        );

      await this.prisma.customerProfile.create({
        data: {
          userId,
          ownerId: invite.ownerId,
          registeredCustomerId: invite.id,
          customerCode: dto.customerCode,

          morningCowQty: dto.morningCowQty,
          morningBuffaloQty: dto.morningBuffaloQty,

          eveningCowQty: dto.eveningCowQty,
          eveningBuffaloQty: dto.eveningBuffaloQty,
        },
      });
      const userInfo = await this.finishOnboarding(userId);

      return userInfo;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while creating customer profile',
          error: error.message,
        });
      }
    }
  }

  async finishOnboarding(userId: number): Promise<any> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          onboarded: true,
          onboardingStep: 3,
        },
        include: {
          ownerProfile: true,
          customerProfile: {
            include: {
              owner: {
                include: {
                  user: {
                    select: {
                      fullName: true,
                      mobileNumber: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (user.customerProfile?.owner?.user) {
        const ownerUser = user.customerProfile.owner.user;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { owner, ...customerProfileWithoutOwner } = user.customerProfile;

        return {
          ...user,
          customerProfile: {
            ...customerProfileWithoutOwner,
            ownerUser,
          },
        };
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Error while finishing onboarding',
          error: error.message,
        });
      }
    }
  }

  async createCustomerInvite(ownerId: number, mobile: string) {
    const ownerInfo = await this.prisma.ownerProfile.findUnique({
      where: { id: ownerId },
    });

    if (!ownerInfo) {
      throw new NotFoundException('Owner not found');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return this.prisma.registeredCustomer.create({
      data: {
        ownerId,
        mobileNumber: mobile,
        customerCode: code,
      },
    });
  }
}
