import { Injectable } from '@nestjs/common';
import { BasicInfoDto } from './dto/basic-info.dto.js';
import { RoleDto } from './dto/role.dto.js';
import { OwnerConfigDto } from './dto/owner-config.dto.js';
import { CustomerConfigDto } from './dto/customer-config.dto.js';
import { AuthRepository } from './auth.repositary.js';
import { GetUserResponse } from './auth.repositary.types.js';
import { User } from '../../generated/prisma/client.js';

@Injectable()
export class AuthService {
  constructor(private authRepositary: AuthRepository) {}

  async getUser(firebaseUid: string): Promise<GetUserResponse> {
    return this.authRepositary.getUser(firebaseUid);
  }

  async createUser(dto: BasicInfoDto): Promise<User> {
    return this.authRepositary.createUser(dto);
  }

  async updateRole(userId: number, dto: RoleDto): Promise<User> {
    return this.authRepositary.updateRole(userId, dto.role);
  }

  async createOwnerProfile(
    userId: number,
    dto: OwnerConfigDto,
  ): Promise<GetUserResponse> {
    return await this.authRepositary.createOwnerProfile(userId, dto);
  }

  async createCustomerProfile(
    userId: number,
    dto: CustomerConfigDto,
  ): Promise<GetUserResponse> {
    return await this.authRepositary.createCustomerProfile(userId, dto);
  }
}
