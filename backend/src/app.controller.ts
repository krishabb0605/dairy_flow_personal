import { Controller, Get, Logger } from '@nestjs/common';

import { AppService } from './app.service.js';
import { Public } from './common/decorators/public.decorator.js';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @Public()
  health(): string {
    this.logger.log('Health check triggered');
    return 'Health check triggered';
  }
}
