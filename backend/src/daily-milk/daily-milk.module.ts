import { Module } from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { CustomerOwnerRepository } from '../customer-owner/customer-owner.repositary.js';
import { ExtraMilkOrderRepository } from '../extra-milk-order/extra-milk-order.repositary.js';
import { VacationScheduleRepository } from '../vacation-schedule/vacation-schedule.repository.js';
import { DailyMilkRepository } from './daily-milk.repository.js';

import { DailyMilkService } from './daily-milk.service.js';

import { DailyMilkController } from './daily-milk.controller.js';

import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DailyMilkController],
  providers: [
    DailyMilkService,
    DailyMilkRepository,
    CustomerOwnerRepository,
    ExtraMilkOrderRepository,
    VacationScheduleRepository,
    ResponseHandler,
  ],
})
export class DailyMilkModule {}
