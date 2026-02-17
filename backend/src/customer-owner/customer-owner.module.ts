import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ResponseHandler } from '../common/response.handler.js';
import { CustomerOwnerController } from './customer-owner.controller.js';
import { CustomerOwnerService } from './customer-owner.service.js';
import { CustomerOwnerRepository } from './customer-owner.repositary.js';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerOwnerController],
  providers: [CustomerOwnerService, CustomerOwnerRepository, ResponseHandler],
})
export class CustomerOwnerModule {}
