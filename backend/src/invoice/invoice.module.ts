import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { DailyMilkModule } from '../daily-milk/daily-milk.module.js';

import { InvoiceRepository } from './invoice.repository.js';
import { InvoiceService } from './invoice.service.js';

@Module({
  imports: [PrismaModule, DailyMilkModule],
  providers: [InvoiceRepository, InvoiceService],
  exports: [InvoiceRepository, InvoiceService],
})
export class InvoiceModule {}
