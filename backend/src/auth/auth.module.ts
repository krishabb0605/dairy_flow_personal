import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthRepository } from './auth.repositary.js';
import { ResponseHandler } from '../../src/common/response.handler.js';
import { PrismaModule } from '../../src/prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, ResponseHandler],
  exports: [AuthRepository],
})
export class AuthModule {}
