import { Module } from '@nestjs/common';

import { ResponseHandler } from '../common/response.handler.js';

import { CustomerOwnerRepository } from '../customer-owner/customer-owner.repositary.js';
import { ExtraMilkOrderRepository } from './extra-milk-order.repositary.js';

import { ExtraMilkOrderService } from './extra-milk-order.service.js';

import { ExtraMilkOrderController } from './extra-milk-order.controller.js';

import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ExtraMilkOrderController],
  providers: [
    ExtraMilkOrderService,
    ExtraMilkOrderRepository,
    CustomerOwnerRepository,
    ResponseHandler,
  ],
})
export class ExtraMilkOrderModule {}
