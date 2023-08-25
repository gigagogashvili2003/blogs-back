import { AccessTokenGuard, AuthLibService, DeactivatedDisabledAccountInterceptor, RefreshTokenGuard } from '@app/auth-lib';
import { CreateUserDto } from '@app/users-lib/dtos.ts/create-user.dto';
import { LocalGuard } from '@app/auth-lib/guards/local-strategy.guard';
import { Body, Controller, Post, Req, UseGuards, Get, UseInterceptors, Put } from '@nestjs/common';
import { RequestWithUser } from '@app/common-lib/interfaces/request-with-user';
import { User } from '@app/users-lib/entities/user.entity';
import { OtpDto } from '@app/users-lib/dtos.ts/otp.dto';
import { PasswordInstructionsDto } from '@app/users-lib/dtos.ts/forgot-password-instructions.dto';
import { ForgotPasswordDto } from '@app/users-lib/dtos.ts/forgot-password.dto';
import { RedisKeyTypes } from '@app/common-lib/types/redis.types';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authLibService: AuthLibService) {}

  @Post('signup')
  public async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authLibService.signup(createUserDto);
  }

  @Post('forgot-password-instructions')
  public async sendForgotPasswordInstuctions(@Body() passwordInstructionsDto: PasswordInstructionsDto) {
    return await this.authLibService.sendForgotPasswordInstructions(passwordInstructionsDto);
  }
  @Put('forgot-password')
  public async recoverForgottenPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authLibService.updateForgottenPassword(forgotPasswordDto);
  }

  @UseInterceptors(DeactivatedDisabledAccountInterceptor)
  @UseGuards(LocalGuard)
  @Post('signin')
  public async signin(@Req() request: RequestWithUser<User>) {
    return await this.authLibService.signin(request);
  }

  @UseGuards(AccessTokenGuard)
  @Post('account-verification')
  public async sendVerificationCode(@Req() request: RequestWithUser<User>) {
    return await this.authLibService.sendVerificationCode(request.user, RedisKeyTypes.ACCOUNT_VERIFICATION, 'Account Verification');
  }

  @UseGuards(AccessTokenGuard)
  @Post('verify-account')
  public async verifyaccount(@Req() request: RequestWithUser<User>, @Body() otpDto: OtpDto) {
    return await this.authLibService.verifyAccount(request.user, otpDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  public async refreshToken(@Req() request: RequestWithUser<User>) {
    return await this.authLibService.refreshToken(request.user);
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  public async signout(@Req() request: RequestWithUser<User>) {
    return await this.authLibService.signout(request);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('ping')
  public async ping() {
    return this.authLibService.ping();
  }
}
