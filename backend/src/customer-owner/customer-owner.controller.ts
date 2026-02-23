import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { CreateCustomerOwnerDto } from './dto/create-customer-owner.dto.js';

import { CustomerOwnerService } from './customer-owner.service.js';

@Controller('customer-owner')
export class CustomerOwnerController {
  constructor(
    private customerOwnerService: CustomerOwnerService,
    private responseHandler: ResponseHandler,
  ) {}

  @Post('create')
  createCustomerOwner(@Body() dto: CreateCustomerOwnerDto) {
    return this.responseHandler.sendResponse(
      this.customerOwnerService.createCustomerOwner(dto),
    );
  }

  @Patch('deactivate/:customerOwnerId')
  deactivateCustomerOwner(
    @Param('customerOwnerId', ParseIntPipe) customerOwnerId: number,
  ) {
    return this.responseHandler.sendResponse(
      this.customerOwnerService.deactivateCustomerOwner(customerOwnerId),
    );
  }

  @Get('upcoming/:customerOwnerId')
  getUpcomingCustomerActivity(
    @Param('customerOwnerId', ParseIntPipe) customerOwnerId: number,
  ) {
    return this.responseHandler.sendResponse(
      this.customerOwnerService.getUpcomingCustomerActivity(customerOwnerId),
    );
  }

  @Get('customers/:ownerId')
  getOwnerCustomers(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
    @Query('status') status = 'all',
  ) {
    return this.responseHandler.sendResponse(
      this.customerOwnerService.getOwnerCustomers(ownerId, {
        page: Number(page),
        limit: Number(limit),
        search,
        status,
      }),
    );
  }
}
