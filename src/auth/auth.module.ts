import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthLibModule } from '@app/auth-lib';
import { NotificationsLibModule } from '@app/notifications-lib';
import { UsersLibModule } from '@app/users-lib';

@Module({
  imports: [AuthLibModule, NotificationsLibModule, UsersLibModule],
  providers: [],
  controllers: [AuthController],
})
export class AuthModule {}
