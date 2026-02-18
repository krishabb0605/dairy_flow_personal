import { Body, Controller, Post } from '@nestjs/common';
import { ResponseHandler } from '../common/response.handler.js';
import { CreateVacationScheduleDto } from './dto/create-vacation-schedule.dto.js';
import { ScheduleVacationService } from './schedule-vacation.service.js';

@Controller('schedule-vacation')
export class ScheduleVacationController {
  constructor(
    private scheduleVacationService: ScheduleVacationService,
    private responseHandler: ResponseHandler,
  ) {}

  @Post('create')
  createVacationSchedule(@Body() dto: CreateVacationScheduleDto) {
    return this.responseHandler.sendResponse(
      this.scheduleVacationService.createVacationSchedule(dto),
    );
  }
}
