import { NestFactory } from '@nestjs/core';
import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';

import { AppModule } from './app.module.js';
import { FirebaseAuthGuard } from './common/guards/firebase-auth.guard.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors();

  app.useGlobalGuards(app.get(FirebaseAuthGuard));

  app.use(
    '/invoice/stripe/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
