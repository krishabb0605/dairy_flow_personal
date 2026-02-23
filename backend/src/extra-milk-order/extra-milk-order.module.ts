import { Module, forwardRef } from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { ExtraMilkOrderRepository } from './extra-milk-order.repositary.js';

import { ExtraMilkOrderService } from './extra-milk-order.service.js';

import { ExtraMilkOrderController } from './extra-milk-order.controller.js';

import { CustomerOwnerModule } from '../customer-owner/customer-owner.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, forwardRef(() => CustomerOwnerModule)],
  controllers: [ExtraMilkOrderController],
  providers: [ExtraMilkOrderService, ExtraMilkOrderRepository, ResponseHandler],
  exports: [ExtraMilkOrderRepository],
})
export class ExtraMilkOrderModule {}
