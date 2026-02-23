import { Injectable } from '@nestjs/common';

import { CreateCustomerOwnerDto } from './dto/create-customer-owner.dto.js';

import { CustomerOwnerRepository } from './customer-owner.repositary.js';

@Injectable()
export class CustomerOwnerService {
  constructor(private customerOwnerRepository: CustomerOwnerRepository) {}

  async createCustomerOwner(dto: CreateCustomerOwnerDto): Promise<any> {
    return this.customerOwnerRepository.createCustomerOwner(dto);
  }

  async deactivateCustomerOwner(customerOwnerId: number): Promise<any> {
    return this.customerOwnerRepository.deactivateCustomerOwner(
      customerOwnerId,
    );
  }

  async getUpcomingCustomerActivity(customerOwnerId: number): Promise<any> {
    return this.customerOwnerRepository.getUpcomingCustomerActivity(
      customerOwnerId,
    );
  }

  async getOwnerCustomers(
    ownerId: number,
    params: {
      page: number;
      limit: number;
      search: string;
      status: string;
    },
  ): Promise<any> {
    return this.customerOwnerRepository.getOwnerCustomers(ownerId, params);
  }
}
