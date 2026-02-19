import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ResponseHandler } from '../common/response.handler.js';
import { CustomerOwnerService } from './customer-owner.service.js';
import { CreateCustomerOwnerDto } from './dto/create-customer-owner.dto.js';

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
}
