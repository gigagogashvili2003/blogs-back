import { Module } from '@nestjs/common';
import { UsersLibModule, UsersLibService } from '@app/users-lib';
import { UtilsLibModule } from '@app/utils-lib';
import { SecurityLibModule } from '@app/security-lib';
import { PassportModule } from '@nestjs/passport';
import { NotificationsLibModule } from '@app/notifications-lib';
import { RedisLibModule } from '@app/redis-lib';
import { AccessTokenStrategy, IsVerifiedStrategy, LocalStrategy, RefreshTokenStrategy } from './strategies';
import { AuthLibService } from './services';
@Module({
  imports: [UsersLibModule, PassportModule, SecurityLibModule, UtilsLibModule, NotificationsLibModule, RedisLibModule, SecurityLibModule],
  providers: [AuthLibService, AccessTokenStrategy, IsVerifiedStrategy, LocalStrategy, RefreshTokenStrategy],
  exports: [AuthLibService],
})
export class AuthLibModule {}
