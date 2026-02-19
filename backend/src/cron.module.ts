import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DailyMilkModule } from './daily-milk/daily-milk.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, DailyMilkModule],
})
export class CronModule {}
