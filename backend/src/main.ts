import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';

import { AppModule } from './app.module.js';
import { FirebaseAuthGuard } from './common/guards/firebase-auth.guard.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const logger = new Logger('HTTP');
  app.enableCors();

  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.log(`${req.method} ${req.originalUrl}`);
    next();
  });

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
