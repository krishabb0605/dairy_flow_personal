import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateExtraMilkOrderDto } from './dto/create-extra-milk-order.dto.js';

import { CustomerOwnerRepository } from '../customer-owner/customer-owner.repositary.js';
import { ExtraMilkOrderRepository } from './extra-milk-order.repositary.js';

@Injectable()
export class ExtraMilkOrderService {
  constructor(
    private extraMilkOrderRepository: ExtraMilkOrderRepository,
    private customerOwnerRepository: CustomerOwnerRepository,
  ) {}

  async createExtraMilkOrder(dto: CreateExtraMilkOrderDto): Promise<any> {
    const customerOwner =
      await this.customerOwnerRepository.findCustomerOwnerById(
        dto.customerOwnerId,
      );

    if (!customerOwner) {
      throw new NotFoundException(
        `Customer-owner relation not found with id: ${dto.customerOwnerId}`,
      );
    }

    if (!customerOwner.isActivated) {
      throw new BadRequestException(
        'Customer-owner relation is not active. Please activate first.',
      );
    }

    return this.extraMilkOrderRepository.createExtraMilkOrder(dto);
  }
}
