import { Module } from '@nestjs/common';

import { CustomerOwnerRepository } from '../customer-owner/customer-owner.repositary.js';
import { CustomerSettingsRepository } from '../customer-settings/customer-settings.repository.js';
import { OwnerSettingsRepository } from '../owner-settings/owner-settings.repository.js';
import { UserRepository } from '../user/user.repository.js';
import { AuthRepository } from './auth.repositary.js';

import { AuthService } from './auth.service.js';

import { AuthController } from './auth.controller.js';

import { PrismaModule } from '../../src/prisma/prisma.module.js';

import { ResponseHandler } from '../../src/common/response.handler.js';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    UserRepository,
    CustomerOwnerRepository,
    OwnerSettingsRepository,
    CustomerSettingsRepository,
    ResponseHandler,
  ],
  exports: [AuthRepository],
})
export class AuthModule {}
