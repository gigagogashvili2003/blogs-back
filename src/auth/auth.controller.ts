import { AccessTokenGuard, AuthLibService, RefreshTokenGuard } from '@app/auth-lib';
import { CreateUserDto } from '@app/users-lib/dtos.ts/create-user.dto';
import { LocalGuard } from '@app/auth-lib/guards/local-strategy.guard';
import { Body, Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { RequestWithUser } from '@app/common-lib/interfaces/request-with-user';
import { User } from '@app/users-lib/entities/user.entity';
import { OtpDto } from '@app/users-lib/dtos.ts/otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authLibService: AuthLibService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authLibService.signup(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() request: RequestWithUser<User>) {
    return await this.authLibService.signin(request);
  }

  @UseGuards(AccessTokenGuard)
  @Post('account-verification')
  async sendVerificationCode(@Req() request: RequestWithUser<User>) {
    return await this.authLibService.sendVerificationCode(request.user);
  }

  @UseGuards(AccessTokenGuard)
  @Post('verify-account')
  async verifyaccount(@Req() request: RequestWithUser<User>, @Body() otpDto: OtpDto) {
    return await this.authLibService.verifyAccount(request.user, otpDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() request: RequestWithUser<User>) {
    return await this.authLibService.refreshToken(request.user);
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  async signout(@Req() request: RequestWithUser<User>) {
    return await this.authLibService.signout(request);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('ping')
  async ping() {
    return this.authLibService.ping();
  }
}
