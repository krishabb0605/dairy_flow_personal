import { Body, Controller, Post } from '@nestjs/common';
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
}
