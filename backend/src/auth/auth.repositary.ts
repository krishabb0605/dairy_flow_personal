import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, type User, type UserRole } from '@prisma/client';

import { BasicInfoDto } from './dto/basic-info.dto.js';
import { CustomerConfigDto } from './dto/customer-config.dto.js';
import { OwnerConfigDto } from './dto/owner-config.dto.js';
import { UpdateCustomerSettingsDto } from './dto/update-customer-settings.dto.js';
import { UpdateOwnerSettingsDto } from './dto/update-owner-settings.dto.js';

import { CustomerOwnerRepository } from '../customer-owner/customer-owner.repositary.js';
import { CustomerSettingsRepository } from '../customer-settings/customer-settings.repository.js';
import { OwnerSettingsRepository } from '../owner-settings/owner-settings.repository.js';
import { UserRepository } from '../user/user.repository.js';

import { PrismaService } from '../prisma/prisma.service.js';

import type {
  CurrentActiveOwner,
  CustomerOwnerWithOwnerUser,
  GetUserResponse,
  UserWithSettings,
} from './auth.repositary.types.js';

@Injectable()
export class AuthRepository {
  constructor(
    private prisma: PrismaService,
    private userRepository: UserRepository,
    private customerOwnerRepository: CustomerOwnerRepository,
    private ownerSettingsRepository: OwnerSettingsRepository,
    private customerSettingsRepository: CustomerSettingsRepository,
  ) {}

  async getUser(firebaseUid: string): Promise<GetUserResponse> {
    const user =
      await this.userRepository.findByFirebaseUidWithSettings(firebaseUid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.buildUserResponse(user);
  }

  private async buildUserResponse(
    user: UserWithSettings,
  ): Promise<GetUserResponse> {
    if (!(user.role === 'CUSTOMER' && user.customerSettings)) {
      return {
        ...user,
        currentActiveOwner: null,
      };
    }

    const currentActiveOwner = this.mapCurrentActiveOwner(
      await this.fetchCurrentActiveOwner(user.customerSettings.id),
    );

    return {
      ...user,
      currentActiveOwner,
    };
  }

  private async fetchCurrentActiveOwner(
    customerId: number,
  ): Promise<CustomerOwnerWithOwnerUser | null> {
    return this.customerOwnerRepository.findCurrentActiveOwnerWithOwnerUser(
      customerId,
    );
  }

  private mapCurrentActiveOwner(
    currentActiveOwner: CustomerOwnerWithOwnerUser | null,
  ): CurrentActiveOwner | null {
    if (!currentActiveOwner?.owner) return null;

    const owner = currentActiveOwner.owner;
    const ownerUser = owner.user;

    return {
      id: currentActiveOwner.id,
      ownerId: owner.id,
      ownerUserId: owner.userId,
      ownerFullName: ownerUser?.fullName ?? null,
      ownerMobileNumber: ownerUser?.mobileNumber ?? null,
      ownerEmail: ownerUser?.email ?? null,
      ownerAddress: ownerUser?.address ?? null,
      dairyName: owner.dairyName,
      cowEnabled: owner.cowEnabled,
      cowPrice: owner.cowPrice,
      buffaloEnabled: owner.buffaloEnabled,
      buffaloPrice: owner.buffaloPrice,
      morningStart: owner.morningStart,
      morningEnd: owner.morningEnd,
      eveningStart: owner.eveningStart,
      eveningEnd: owner.eveningEnd,
      upiId: owner.upiId,
      bankName: owner.bankName,
      accountNumber: owner.accountNumber,
      ifscCode: owner.ifscCode,
    };
  }

  async createUser(userBasicInfo: BasicInfoDto): Promise<User> {
    const { firebaseUid, ...userInfo } = userBasicInfo;
    try {
      return await this.userRepository.upsertByFirebaseUid(firebaseUid, {
        firebaseUid,
        ...userInfo,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException({
            success: false,
            message:
              'Mobile number already registered. Please use another number.',
          });
        }
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create user. Please try again later.',
      });
    }
  }

  async updateRole(userId: number, role: UserRole): Promise<User> {
    try {
      return await this.userRepository.updateRole(userId, role);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException({
        success: false,
        message: 'Error while updating user role',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async createOwnerProfile(
    userId: number,
    dto: OwnerConfigDto,
  ): Promise<GetUserResponse> {
    try {
      await this.ownerSettingsRepository.createOwnerSettings({
        userId,
        dairyName: dto.dairyName,
        cowEnabled: dto.cowEnabled,
        cowPrice: dto.cowPrice,
        buffaloEnabled: dto.buffaloEnabled,
        buffaloPrice: dto.buffaloPrice,
      });

      const userInfo = await this.finishOnboarding(userId);

      return this.buildUserResponse(userInfo);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException({
        success: false,
        message: 'Error while creating owner profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async createCustomerProfile(
    userId: number,
    dto: CustomerConfigDto,
  ): Promise<GetUserResponse> {
    try {
      await this.customerSettingsRepository.createCustomerSettings({
        userId,
        morningCowQty: dto.morningCowQty,
        morningBuffaloQty: dto.morningBuffaloQty,
        eveningCowQty: dto.eveningCowQty,
        eveningBuffaloQty: dto.eveningBuffaloQty,
      });

      const userInfo = await this.finishOnboarding(userId);

      return this.buildUserResponse(userInfo);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException({
        success: false,
        message: 'Error while creating customer profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async updateCustomerSettings(
    userId: number,
    dto: UpdateCustomerSettingsDto,
  ): Promise<GetUserResponse> {
    try {
      const existingUser = await this.userRepository.findById(userId);

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      if (existingUser.role !== 'CUSTOMER') {
        throw new BadRequestException(
          'Only customer can update these settings',
        );
      }

      await this.prisma.$transaction(async (tx) => {
        await this.userRepository.updateProfile(
          {
            userId,
            fullName: dto.fullName,
            address: dto.address,
            profileImageUrl: dto.profileImageUrl ?? null,
          },
          tx,
        );
        await this.customerSettingsRepository.updateCustomerSettingsByUserId({
          userId,
          morningCowQty: dto.morningCowQty,
          morningBuffaloQty: dto.morningBuffaloQty,
          eveningCowQty: dto.eveningCowQty,
          eveningBuffaloQty: dto.eveningBuffaloQty,
        });
      });

      const updatedUser =
        await this.userRepository.findByIdWithSettings(userId);

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return this.buildUserResponse(updatedUser);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException({
        success: false,
        message: 'Error while updating customer settings',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async updateOwnerSettings(
    userId: number,
    dto: UpdateOwnerSettingsDto,
  ): Promise<GetUserResponse> {
    try {
      const existingUser = await this.userRepository.findById(userId);

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      if (existingUser.role !== 'OWNER') {
        throw new BadRequestException('Only owner can update these settings');
      }

      await this.prisma.$transaction(async (tx) => {
        await this.userRepository.updateProfile(
          {
            userId,
            fullName: dto.fullName,
            address: dto.address,
            profileImageUrl: dto.profileImageUrl ?? null,
          },
          tx,
        );
        await this.ownerSettingsRepository.updateOwnerSettingsByUserId(
          {
            userId,
            cowEnabled: dto.cowEnabled,
            cowPrice: dto.cowPrice,
            buffaloEnabled: dto.buffaloEnabled,
            buffaloPrice: dto.buffaloPrice,
            morningStart: this.toTimeDate(dto.morningStart),
            morningEnd: this.toTimeDate(dto.morningEnd),
            eveningStart: this.toTimeDate(dto.eveningStart),
            eveningEnd: this.toTimeDate(dto.eveningEnd),
            upiId: dto.upiId ?? null,
            bankName: dto.bankName ?? null,
            accountNumber: dto.accountNumber ?? null,
            ifscCode: dto.ifscCode ?? null,
          },
          tx,
        );
      });

      const updatedUser =
        await this.userRepository.findByIdWithSettings(userId);

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return this.buildUserResponse(updatedUser);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException({
        success: false,
        message: 'Error while updating owner settings',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private toTimeDate(time: string): Date {
    const [hoursText, minutesText] = time.split(':');
    const hours = Number(hoursText);
    const minutes = Number(minutesText);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new BadRequestException(`Invalid time format: ${time}`);
    }

    return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
  }

  async finishOnboarding(userId: number): Promise<UserWithSettings> {
    try {
      return await this.userRepository.updateOnboarding(userId);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException({
        success: false,
        message: 'Error while finishing onboarding',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
