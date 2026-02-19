import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { CronModule } from './cron.module.js';

async function bootstrap() {
  await NestFactory.createApplicationContext(CronModule);
}

bootstrap();
