import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { CustomerSettingsService } from './customer-settings.service.js';

@Controller('customer-settings')
export class CustomerSettingsController {
  constructor(
    private customerSettingsService: CustomerSettingsService,
    private responseHandler: ResponseHandler,
  ) {}

  @Get('profile/:customerOwnerId')
  getCustomerProfile(
    @Param('customerOwnerId', ParseIntPipe) customerOwnerId: number,
  ) {
    return this.responseHandler.sendResponse(
      this.customerSettingsService.getCustomerProfile(customerOwnerId),
    );
  }

  @Get('delivery-history/:customerOwnerId')
  getCustomerDeliveryHistory(
    @Param('customerOwnerId', ParseIntPipe) customerOwnerId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status') status?: string,
    @Query('slot') slot?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.responseHandler.sendResponse(
      this.customerSettingsService.getCustomerDeliveryHistory(customerOwnerId, {
        page: Number(page),
        limit: Number(limit),
        status,
        slot,
        startDate,
        endDate,
      }),
    );
  }
}
