import { Module } from '@nestjs/common';

import { OwnerSettingsRepository } from '../owner-settings/owner-settings.repository.js';
import { UserRepository } from '../user/user.repository.js';
import { AuthRepository } from './auth.repositary.js';

import { AuthService } from './auth.service.js';

import { AuthController } from './auth.controller.js';

import { CustomerSettingsModule } from '../customer-settings/customer-settings.module.js';
import { CustomerOwnerModule } from '../customer-owner/customer-owner.module.js';
import { PrismaModule } from '../../src/prisma/prisma.module.js';

import { ResponseHandler } from '../../src/common/response.handler.js';

@Module({
  imports: [PrismaModule, CustomerOwnerModule, CustomerSettingsModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    UserRepository,
    OwnerSettingsRepository,
    ResponseHandler,
  ],
  exports: [AuthRepository],
})
export class AuthModule {}
