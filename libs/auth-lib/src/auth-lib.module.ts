import { Module } from '@nestjs/common';
import { UsersLibModule } from '@app/users-lib';
import { UtilsLibModule } from '@app/utils-lib';
import { PassportModule } from '@nestjs/passport';
import { NotificationsLibModule } from '@app/notifications-lib';
import { RedisLibModule } from '@app/redis-lib';
import { AccessTokenStrategy, IsVerifiedStrategy, LocalStrategy, RefreshTokenStrategy } from './strategies';
import { AuthLibService } from './services';
@Module({
  imports: [PassportModule, UsersLibModule, UtilsLibModule, NotificationsLibModule, RedisLibModule],
  providers: [AuthLibService, AccessTokenStrategy, IsVerifiedStrategy, LocalStrategy, RefreshTokenStrategy],
  exports: [AuthLibService],
})
export class AuthLibModule {}
