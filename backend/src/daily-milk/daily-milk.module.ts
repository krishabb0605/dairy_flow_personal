import { Module } from '@nestjs/common';
import { ResponseHandler } from '../common/response.handler.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { DailyMilkController } from './daily-milk.controller.js';
import { DailyMilkRepository } from './daily-milk.repository.js';
import { DailyMilkService } from './daily-milk.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [DailyMilkController],
  providers: [DailyMilkService, DailyMilkRepository, ResponseHandler],
})
export class DailyMilkModule {}
