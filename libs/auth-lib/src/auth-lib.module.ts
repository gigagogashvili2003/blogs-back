import { Module } from '@nestjs/common';
import { AuthLibService } from './auth-lib.service';
import { UsersLibModule } from '@app/users-lib';
import { UtilsLibModule } from '@app/utils-lib';
import { PassportModule } from '@nestjs/passport';
import { NotificationsLibModule } from '@app/notifications-lib';
import { RedisLibModule } from '@app/redis-lib';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';
@Module({
  imports: [PassportModule, UsersLibModule, UtilsLibModule, NotificationsLibModule, RedisLibModule],
  providers: [AuthLibService, AccessTokenStrategy, LocalStrategy],
  exports: [AuthLibService],
})
export class AuthLibModule {}
