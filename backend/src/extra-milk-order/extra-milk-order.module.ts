import { Module } from '@nestjs/common';
import { ResponseHandler } from '../common/response.handler.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ExtraMilkOrderController } from './extra-milk-order.controller.js';
import { ExtraMilkOrderRepository } from './extra-milk-order.repositary.js';
import { ExtraMilkOrderService } from './extra-milk-order.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ExtraMilkOrderController],
  providers: [ExtraMilkOrderService, ExtraMilkOrderRepository, ResponseHandler],
})
export class ExtraMilkOrderModule {}
