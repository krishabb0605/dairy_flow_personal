import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { DailyMilkService } from './daily-milk.service.js';

@Module({
  imports: [PrismaModule],
  providers: [DailyMilkService],
})
export class DailyMilkModule {}
