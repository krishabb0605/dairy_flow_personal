import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CustomerOwnerModule } from './customer-owner/customer-owner.module.js';
import { ExtraMilkOrderModule } from './extra-milk-order/extra-milk-order.module.js';
import { ScheduleVacationModule } from './schedule-vacation/schedule-vacation.module.js';
import { DailyMilkModule } from './daily-milk/daily-milk.module.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    CustomerOwnerModule,
    ExtraMilkOrderModule,
    ScheduleVacationModule,
    DailyMilkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
