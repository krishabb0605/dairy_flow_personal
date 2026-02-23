import { Module } from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { CustomerOwnerRepository } from './customer-owner.repositary.js';
import { OwnerSettingsRepository } from '../owner-settings/owner-settings.repository.js';
import { UserRepository } from '../user/user.repository.js';

import { CustomerOwnerService } from './customer-owner.service.js';

import { CustomerOwnerController } from './customer-owner.controller.js';

import { ExtraMilkOrderModule } from '../extra-milk-order/extra-milk-order.module.js';
import { ScheduleVacationModule } from '../schedule-vacation/schedule-vacation.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, ExtraMilkOrderModule, ScheduleVacationModule],
  controllers: [CustomerOwnerController],
  providers: [
    CustomerOwnerService,
    CustomerOwnerRepository,
    OwnerSettingsRepository,
    UserRepository,
    ResponseHandler,
  ],
  exports: [CustomerOwnerRepository],
})
export class CustomerOwnerModule {}
