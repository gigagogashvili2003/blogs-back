import { Module } from '@nestjs/common';
import { UsersLibModule } from '@app/users-lib';
import { TaskLibService } from './services';
import { MailSenderService } from '@app/notifications-lib';

@Module({
  imports: [UsersLibModule],
  providers: [TaskLibService, MailSenderService],
  exports: [TaskLibService],
})
export class TaskLibModule {}
