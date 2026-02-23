import { Module } from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { CustomerSettingsRepository } from './customer-settings.repository.js';

import { CustomerSettingsService } from './customer-settings.service.js';

import { CustomerSettingsController } from './customer-settings.controller.js';

import { CustomerOwnerModule } from '../customer-owner/customer-owner.module.js';
import { DailyMilkModule } from '../daily-milk/daily-milk.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, CustomerOwnerModule, DailyMilkModule],
  controllers: [CustomerSettingsController],
  providers: [
    CustomerSettingsService,
    CustomerSettingsRepository,
    ResponseHandler,
  ],
  exports: [CustomerSettingsRepository],
})
export class CustomerSettingsModule {}
