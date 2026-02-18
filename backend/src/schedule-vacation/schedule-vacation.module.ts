import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ResponseHandler } from '../common/response.handler.js';
import { ScheduleVacationController } from './schedule-vacation.controller.js';
import { ScheduleVacationRepository } from './schedule-vacation.repositary.js';
import { ScheduleVacationService } from './schedule-vacation.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ScheduleVacationController],
  providers: [
    ScheduleVacationService,
    ScheduleVacationRepository,
    ResponseHandler,
  ],
})
export class ScheduleVacationModule {}
