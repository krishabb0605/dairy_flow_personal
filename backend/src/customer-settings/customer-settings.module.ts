import { Module } from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { CustomerSettingsRepository } from './customer-settings.repository.js';
import { CustomerOwnerRepository } from '../customer-owner/customer-owner.repositary.js';
import { DailyMilkRepository } from '../daily-milk/daily-milk.repository.js';

import { CustomerSettingsService } from './customer-settings.service.js';

import { CustomerSettingsController } from './customer-settings.controller.js';

import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerSettingsController],
  providers: [
    CustomerSettingsService,
    CustomerSettingsRepository,
    CustomerOwnerRepository,
    DailyMilkRepository,
    ResponseHandler,
  ],
})
export class CustomerSettingsModule {}
