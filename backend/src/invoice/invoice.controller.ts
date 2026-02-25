import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';

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

  @Post('customer/:customerOwnerId/checkout')
  createCustomerCheckoutSession(
    @Param('customerOwnerId') customerOwnerId: number,
    @Body('invoiceId') invoiceId: number,
  ) {
    return this.responseHandler.sendResponse(
      this.invoiceService.createStripeCheckoutSession(
        Number(customerOwnerId),
        Number(invoiceId),
      ),
    );
  }

  @Post('stripe/webhook')
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      const signature = req.headers['stripe-signature'];
      if (!signature) {
        return res.status(400).json({ message: 'Stripe webhook error' });
      }

      const response = await this.invoiceService.handleStripeWebhook(
        signature,
        req.body,
      );
      return res.status(200).json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Stripe webhook error';
      return res.status(400).json({ message });
    }
  }
}
