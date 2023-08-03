import { Module } from '@nestjs/common';
import { MailSenderService } from './services';

@Module({
  providers: [MailSenderService],
  exports: [MailSenderService],
})
export class NotificationsLibModule {}
