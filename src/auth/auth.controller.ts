import { AuthLibService } from '@app/auth-lib';
import { CreateUserDto } from '@app/users-lib/dtos.ts/create-user.dto';
import { LocalGuard } from '@app/auth-lib/guards/local-strategy.guard';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authLibService: AuthLibService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authLibService.signup(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() request) {
    console.log(request.user);
    return await this.authLibService.signin();
  }
}
