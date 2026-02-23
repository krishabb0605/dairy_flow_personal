import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // This endpoint is only for testing purposes
  @Post('test')
  async testDatabase(): Promise<string> {
    return await this.appService.testDatabase();
  }
}
