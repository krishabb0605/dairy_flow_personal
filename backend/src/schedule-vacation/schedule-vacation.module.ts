import { Module, forwardRef } from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { VacationScheduleRepository } from '../vacation-schedule/vacation-schedule.repository.js';
import { ScheduleVacationRepository } from './schedule-vacation.repositary.js';

import { ScheduleVacationService } from './schedule-vacation.service.js';

import { ScheduleVacationController } from './schedule-vacation.controller.js';

import { CustomerOwnerModule } from '../customer-owner/customer-owner.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, forwardRef(() => CustomerOwnerModule)],
  controllers: [ScheduleVacationController],
  providers: [
    ScheduleVacationService,
    ScheduleVacationRepository,
    VacationScheduleRepository,
    ResponseHandler,
  ],
  exports: [VacationScheduleRepository],
})
export class ScheduleVacationModule {}
