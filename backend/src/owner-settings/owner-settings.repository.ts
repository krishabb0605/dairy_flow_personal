import { Injectable } from '@nestjs/common';

import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class OwnerSettingsRepository {
  constructor(private prisma: PrismaService) {}

  private getClient(
    tx?: Prisma.TransactionClient,
  ): PrismaClient | Prisma.TransactionClient {
    return tx ?? this.prisma;
  }

  async findById(ownerId: number) {
    return this.prisma.ownerSettings.findUnique({
      where: { id: ownerId },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.ownerSettings.findUnique({
      where: { userId },
    });
  }

  async createOwnerSettings(
    params: {
      userId: number;
      dairyName: string;
      cowEnabled: boolean;
      cowPrice: number;
      buffaloEnabled: boolean;
      buffaloPrice: number;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).ownerSettings.create({
      data: {
        userId: params.userId,
        dairyName: params.dairyName,
        cowEnabled: params.cowEnabled,
        cowPrice: params.cowPrice,
        buffaloEnabled: params.buffaloEnabled,
        buffaloPrice: params.buffaloPrice,
      },
    });
  }

  async updateOwnerSettingsByUserId(
    params: {
      userId: number;
      cowEnabled: boolean;
      cowPrice: number;
      buffaloEnabled: boolean;
      buffaloPrice: number;
      morningStart: Date;
      morningEnd: Date;
      eveningStart: Date;
      eveningEnd: Date;
      upiId?: string | null;
      bankName?: string | null;
      accountNumber?: string | null;
      ifscCode?: string | null;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const {
      userId,
      cowEnabled,
      cowPrice,
      buffaloEnabled,
      buffaloPrice,
      morningStart,
      morningEnd,
      eveningStart,
      eveningEnd,
      upiId,
      bankName,
      accountNumber,
      ifscCode,
    } = params;

    return this.getClient(tx).ownerSettings.update({
      where: { userId },
      data: {
        cowEnabled,
        cowPrice,
        buffaloEnabled,
        buffaloPrice,
        morningStart,
        morningEnd,
        eveningStart,
        eveningEnd,
        upiId: upiId ?? null,
        bankName: bankName ?? null,
        accountNumber: accountNumber ?? null,
        ifscCode: ifscCode ?? null,
      },
    });
  }
}
