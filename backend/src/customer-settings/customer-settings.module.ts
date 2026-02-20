import { Module } from '@nestjs/common';
import { ResponseHandler } from '../common/response.handler.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CustomerSettingsController } from './customer-settings.controller.js';
import { CustomerSettingsRepository } from './customer-settings.repository.js';
import { CustomerSettingsService } from './customer-settings.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerSettingsController],
  providers: [
    CustomerSettingsService,
    CustomerSettingsRepository,
    ResponseHandler,
  ],
})
export class CustomerSettingsModule {}
