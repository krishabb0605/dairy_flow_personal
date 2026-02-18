import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CustomerOwnerModule } from './customer-owner/customer-owner.module.js';
import { ExtraMilkOrderModule } from './extra-milk-order/extra-milk-order.module.js';
import { ScheduleVacationModule } from './schedule-vacation/schedule-vacation.module.js';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    CustomerOwnerModule,
    ExtraMilkOrderModule,
    ScheduleVacationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
