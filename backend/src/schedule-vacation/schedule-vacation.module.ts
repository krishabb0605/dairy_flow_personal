import { Module } from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { CustomerOwnerRepository } from '../customer-owner/customer-owner.repositary.js';
import { VacationScheduleRepository } from '../vacation-schedule/vacation-schedule.repository.js';
import { ScheduleVacationRepository } from './schedule-vacation.repositary.js';

import { ScheduleVacationService } from './schedule-vacation.service.js';

import { ScheduleVacationController } from './schedule-vacation.controller.js';

import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ScheduleVacationController],
  providers: [
    ScheduleVacationService,
    ScheduleVacationRepository,
    CustomerOwnerRepository,
    VacationScheduleRepository,
    ResponseHandler,
  ],
})
export class ScheduleVacationModule {}
