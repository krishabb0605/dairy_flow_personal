import { Injectable } from '@nestjs/common';

import { Prisma, PrismaClient, type User, type UserRole } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  private getClient(
    tx?: Prisma.TransactionClient,
  ): PrismaClient | Prisma.TransactionClient {
    return tx ?? this.prisma;
  }

  async findByFirebaseUidWithSettings(firebaseUid: string) {
    return this.prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        ownerSettings: true,
        customerSettings: true,
      },
    });
  }

  async findById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async findByIdWithSettings(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        ownerSettings: true,
        customerSettings: true,
      },
    });
  }

  async findCustomerByMobileWithSettings(mobileNumber: string) {
    return this.prisma.user.findUnique({
      where: { mobileNumber, role: 'CUSTOMER' },
      include: {
        customerSettings: true,
      },
    });
  }

  async listAll() {
    return this.prisma.user.findMany();
  }

  async upsertByFirebaseUid(
    firebaseUid: string,
    data: Prisma.UserCreateInput,
  ): Promise<User> {
    const { firebaseUid: _firebaseUid, ...rest } =
      data as Prisma.UserCreateInput;
    return this.prisma.user.upsert({
      where: { firebaseUid },
      update: { ...rest },
      create: { ...data },
    });
  }

  async updateRole(
    userId: number,
    role: UserRole,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    return this.getClient(tx).user.update({
      where: { id: userId },
      data: { role, onboardingStep: 2 },
    });
  }

  async updateProfile(
    params: {
      userId: number;
      fullName: string;
      address: string;
      profileImageUrl?: string | null;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const { userId, fullName, address, profileImageUrl } = params;
    return this.getClient(tx).user.update({
      where: { id: userId },
      data: {
        fullName,
        address,
        profileImageUrl: profileImageUrl ?? null,
      },
    });
  }

  async updateOnboarding(userId: number, tx?: Prisma.TransactionClient) {
    return this.getClient(tx).user.update({
      where: { id: userId },
      data: {
        onboarded: true,
        onboardingStep: 3,
      },
      include: {
        ownerSettings: true,
        customerSettings: true,
      },
    });
  }
}
