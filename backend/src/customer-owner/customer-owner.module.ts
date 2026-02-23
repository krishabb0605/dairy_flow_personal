import { Module } from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { CustomerOwnerRepository } from './customer-owner.repositary.js';
import { OwnerSettingsRepository } from '../owner-settings/owner-settings.repository.js';
import { UserRepository } from '../user/user.repository.js';
import { ExtraMilkOrderRepository } from '../extra-milk-order/extra-milk-order.repositary.js';
import { VacationScheduleRepository } from '../vacation-schedule/vacation-schedule.repository.js';

import { CustomerOwnerService } from './customer-owner.service.js';

import { CustomerOwnerController } from './customer-owner.controller.js';

import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerOwnerController],
  providers: [
    CustomerOwnerService,
    CustomerOwnerRepository,
    OwnerSettingsRepository,
    UserRepository,
    ExtraMilkOrderRepository,
    VacationScheduleRepository,
    ResponseHandler,
  ],
})
export class CustomerOwnerModule {}
