import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { DailyMilkModule } from '../daily-milk/daily-milk.module.js';
import { ResponseHandler } from '../common/response.handler.js';

import { InvoiceController } from './invoice.controller.js';
import { InvoiceRepository } from './invoice.repository.js';
import { InvoiceService } from './invoice.service.js';

@Module({
  imports: [PrismaModule, DailyMilkModule],
  controllers: [InvoiceController],
  providers: [InvoiceRepository, InvoiceService, ResponseHandler],
  exports: [InvoiceRepository, InvoiceService],
})
export class InvoiceModule {}
