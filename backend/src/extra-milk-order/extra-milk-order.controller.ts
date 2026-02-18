import { Body, Controller, Post } from '@nestjs/common';
import { ResponseHandler } from '../common/response.handler.js';
import { CreateExtraMilkOrderDto } from './dto/create-extra-milk-order.dto.js';
import { ExtraMilkOrderService } from './extra-milk-order.service.js';

@Controller('extra-milk-order')
export class ExtraMilkOrderController {
  constructor(
    private extraMilkOrderService: ExtraMilkOrderService,
    private responseHandler: ResponseHandler,
  ) {}

  @Post('create')
  createExtraMilkOrder(@Body() dto: CreateExtraMilkOrderDto) {
    return this.responseHandler.sendResponse(
      this.extraMilkOrderService.createExtraMilkOrder(dto),
    );
  }
}
