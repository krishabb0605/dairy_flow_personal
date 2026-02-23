import { Module } from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { DailyMilkRepository } from './daily-milk.repository.js';

import { DailyMilkService } from './daily-milk.service.js';

import { DailyMilkController } from './daily-milk.controller.js';

import { CustomerOwnerModule } from '../customer-owner/customer-owner.module.js';
import { ExtraMilkOrderModule } from '../extra-milk-order/extra-milk-order.module.js';
import { ScheduleVacationModule } from '../schedule-vacation/schedule-vacation.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [
    PrismaModule,
    CustomerOwnerModule,
    ExtraMilkOrderModule,
    ScheduleVacationModule,
  ],
  controllers: [DailyMilkController],
  providers: [DailyMilkService, DailyMilkRepository, ResponseHandler],
  exports: [DailyMilkRepository],
})
export class DailyMilkModule {}
