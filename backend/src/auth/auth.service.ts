import { Injectable } from '@nestjs/common';
import { BasicInfoDto } from './dto/basic-info.dto.js';
import { RoleDto } from './dto/role.dto.js';
import { OwnerConfigDto } from './dto/owner-config.dto.js';
import { CustomerConfigDto } from './dto/customer-config.dto.js';
import { AuthRepository } from './auth.repositary.js';

@Injectable()
export class AuthService {
  constructor(private authRepositary: AuthRepository) {}

  async getUser(firebaseUid: string): Promise<any> {
    return this.authRepositary.getUser(firebaseUid);
  }

  async createUser(dto: BasicInfoDto): Promise<any> {
    return this.authRepositary.createUser(dto);
  }

  async updateRole(userId: number, dto: RoleDto): Promise<any> {
    return this.authRepositary.updateRole(userId, dto.role);
  }

  async createOwnerProfile(userId: number, dto: OwnerConfigDto): Promise<any> {
    return await this.authRepositary.createOwnerProfile(userId, dto);
  }

  async createCustomerProfile(
    userId: number,
    dto: CustomerConfigDto,
  ): Promise<any> {
    return await this.authRepositary.createCustomerProfile(userId, dto);
  }

  async createCustomerInvite(ownerId: number, mobile: string) {
    return await this.authRepositary.createCustomerInvite(ownerId, mobile);
  }
}
