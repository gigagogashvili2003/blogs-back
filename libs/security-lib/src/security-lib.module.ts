import { Module } from '@nestjs/common';
import { SecurityLibService } from './services/security-lib.service';
import { NotificationsLibModule } from '@app/notifications-lib';
import { UsersLibModule } from '@app/users-lib';
import { RedisLibModule } from '@app/redis-lib';

@Module({
  imports: [UsersLibModule, NotificationsLibModule, RedisLibModule],
  providers: [SecurityLibService],
  exports: [SecurityLibService],
})
export class SecurityLibModule {}
