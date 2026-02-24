import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { InvoiceService } from './invoice.service.js';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private invoiceService: InvoiceService,
    private responseHandler: ResponseHandler,
  ) {}

  @Get('owner/:ownerId')
  getOwnerBilling(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
    @Query('status') status = 'all',
    @Query('year') year = 'all',
  ) {
    return this.responseHandler.sendResponse(
      this.invoiceService.getOwnerBilling(ownerId, {
        page: Number(page),
        limit: Number(limit),
        search,
        status,
        year,
      }),
    );
  }

  @Get('customer/:customerOwnerId')
  getCustomerBilling(
    @Param('customerOwnerId', ParseIntPipe) customerOwnerId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('year') year = 'all',
  ) {
    return this.responseHandler.sendResponse(
      this.invoiceService.getCustomerBilling(customerOwnerId, {
        page: Number(page),
        limit: Number(limit),
        year,
      }),
    );
  }

  @Patch(':invoiceId')
  updateInvoice(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
    @Body()
    body: {
      status?: string;
      paymentMethod?: string;
      notes?: string | null;
    },
  ) {
    return this.responseHandler.sendResponse(
      this.invoiceService.updateInvoice(invoiceId, body),
    );
  }
}
