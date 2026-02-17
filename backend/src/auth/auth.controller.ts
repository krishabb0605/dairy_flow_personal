import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { BasicInfoDto } from './dto/basic-info.dto.js';
import { CustomerConfigDto } from './dto/customer-config.dto.js';
import { OwnerConfigDto } from './dto/owner-config.dto.js';
import { RoleDto } from './dto/role.dto.js';
import { UpdateCustomerSettingsDto } from './dto/update-customer-settings.dto.js';
import { UpdateOwnerSettingsDto } from './dto/update-owner-settings.dto.js';
import { ResponseHandler } from '../../src/common/response.handler.js';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private responseHandler: ResponseHandler,
  ) {}

  // @GET api for fetch user data
  @Get('user/:firebaseUid')
  getUser(@Param('firebaseUid') firebaseUid: string) {
    return this.responseHandler.sendResponse(
      this.authService.getUser(firebaseUid),
    );
  }

  @Post('create')
  create(@Body() dto: BasicInfoDto) {
    return this.responseHandler.sendResponse(this.authService.createUser(dto));
  }

  @Post('role/:userId')
  update(@Param('userId') userId: string, @Body() dto: RoleDto) {
    return this.responseHandler.sendResponse(
      this.authService.updateRole(Number(userId), dto),
    );
  }

  @Post('owner-config/:userId')
  ownerConfig(@Param('userId') userId: string, @Body() dto: OwnerConfigDto) {
    return this.responseHandler.sendResponse(
      this.authService.createOwnerProfile(Number(userId), dto),
    );
  }

  @Post('customer-config/:userId')
  customerConfig(
    @Param('userId') userId: string,
    @Body() dto: CustomerConfigDto,
  ) {
    return this.responseHandler.sendResponse(
      this.authService.createCustomerProfile(Number(userId), dto),
    );
  }

  @Post('customer-settings/:userId')
  updateCustomerSettings(
    @Param('userId') userId: string,
    @Body() dto: UpdateCustomerSettingsDto,
  ) {
    return this.responseHandler.sendResponse(
      this.authService.updateCustomerSettings(Number(userId), dto),
    );
  }

  @Post('owner-settings/:userId')
  updateOwnerSettings(
    @Param('userId') userId: string,
    @Body() dto: UpdateOwnerSettingsDto,
  ) {
    return this.responseHandler.sendResponse(
      this.authService.updateOwnerSettings(Number(userId), dto),
    );
  }
}
