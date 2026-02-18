import { Injectable } from '@nestjs/common';
import { CreateExtraMilkOrderDto } from './dto/create-extra-milk-order.dto.js';
import { ExtraMilkOrderRepository } from './extra-milk-order.repositary.js';

@Injectable()
export class ExtraMilkOrderService {
  constructor(private extraMilkOrderRepository: ExtraMilkOrderRepository) {}

  async createExtraMilkOrder(dto: CreateExtraMilkOrderDto): Promise<any> {
    return this.extraMilkOrderRepository.createExtraMilkOrder(dto);
  }
}
