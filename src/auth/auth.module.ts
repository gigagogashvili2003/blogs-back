import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthLibModule, LocalStrategy } from '@app/auth-lib';

@Module({
  imports: [AuthLibModule],
  providers: [LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
