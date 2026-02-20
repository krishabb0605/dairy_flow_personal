import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ResponseHandler } from '../common/response.handler.js';
import { DailyMilkService } from './daily-milk.service.js';
import { UpdateDailyMilkDto } from './dto/update-daily-milk.dto.js';

@Controller('daily-milk')
export class DailyMilkController {
  constructor(
    private dailyMilkService: DailyMilkService,
    private responseHandler: ResponseHandler,
  ) {}

  @Get('owner/:ownerId')
  getOwnerDashboard(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Query('date') date?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
    @Query('slot') slot?: string,
  ) {
    return this.responseHandler.sendResponse(
      this.dailyMilkService.getOwnerDashboard(ownerId, {
        date,
        page: Number(page),
        limit: Number(limit),
        search,
        slot: slot ? (slot.toUpperCase() as 'MORNING' | 'EVENING') : undefined,
      }),
    );
  }

  @Patch(':dailyMilkId')
  updateDailyMilk(
    @Param('dailyMilkId', ParseIntPipe) dailyMilkId: number,
    @Body() dto: UpdateDailyMilkDto,
  ) {
    return this.responseHandler.sendResponse(
      this.dailyMilkService.updateDailyMilk(dailyMilkId, dto),
    );
  }
}
