import { AccessTokenGuard, AuthLibService } from '@app/auth-lib';
import { CreateUserDto } from '@app/users-lib/dtos.ts/create-user.dto';
import { LocalGuard } from '@app/auth-lib/guards/local-strategy.guard';
import { Body, Controller, Post, Req, UseGuards, Get, Res } from '@nestjs/common';
import { RequestWithUser } from '@app/common-lib/interfaces/request-with-user';
import { User } from '@app/users-lib/entities/user.entity';

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
  @Get('hello')
  async getHello() {
    return 'HELLO';
  }
}
