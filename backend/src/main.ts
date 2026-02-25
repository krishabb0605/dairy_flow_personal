import { NestFactory } from '@nestjs/core';
import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors();

  app.use(
    '/invoice/stripe/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
