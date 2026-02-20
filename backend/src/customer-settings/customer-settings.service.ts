import { Injectable } from '@nestjs/common';
import { CustomerSettingsRepository } from './customer-settings.repository.js';

@Injectable()
export class CustomerSettingsService {
  constructor(private customerSettingsRepository: CustomerSettingsRepository) {}

  async getCustomerProfile(customerOwnerId: number): Promise<any> {
    return this.customerSettingsRepository.getCustomerProfile(customerOwnerId);
  }

  async getCustomerDeliveryHistory(
    customerOwnerId: number,
    params: {
      page: number;
      limit: number;
      status?: string;
      slot?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<any> {
    return this.customerSettingsRepository.getCustomerDeliveryHistory(
      customerOwnerId,
      params,
    );
  }
}
