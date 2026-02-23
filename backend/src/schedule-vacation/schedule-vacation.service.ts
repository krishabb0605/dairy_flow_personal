import { Injectable } from '@nestjs/common';

import { CreateVacationScheduleDto } from './dto/create-vacation-schedule.dto.js';

import { ScheduleVacationRepository } from './schedule-vacation.repositary.js';

@Injectable()
export class ScheduleVacationService {
  constructor(private scheduleVacationRepository: ScheduleVacationRepository) {}

  async createVacationSchedule(dto: CreateVacationScheduleDto): Promise<any> {
    return this.scheduleVacationRepository.createVacationSchedule(dto);
  }
}
