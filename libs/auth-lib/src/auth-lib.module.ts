import { Module } from '@nestjs/common';
import { AuthLibService } from './auth-lib.service';
import { UsersLibModule } from '@app/users-lib';
import { UtilsLibModule } from '@app/utils-lib';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [PassportModule, UsersLibModule, UtilsLibModule],
  providers: [AuthLibService],
  exports: [AuthLibService],
})
export class AuthLibModule {}
