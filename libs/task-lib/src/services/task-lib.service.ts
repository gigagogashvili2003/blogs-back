import { MailSenderService } from '@app/notifications-lib';
import { UserRepository } from '@app/users-lib';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskLibService {
  public constructor(private readonly userRepository: UserRepository, private readonly mailSenderService: MailSenderService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async handleDeactivatedUsersJob() {
    try {
      const currentDate = new Date();

      const deactivatedUsers = await this.userRepository.findAll({ where: { isDeactivated: true } });

      for (const value of deactivatedUsers) {
        const timeDeactivated = new Date(value.accountDeactivationDate);

        const differenceInMilleseconds = currentDate.getTime() - timeDeactivated.getTime();

        const days = differenceInMilleseconds / (1000 * 60 * 60 * 24);

        if (days >= 30) {
          await value.destroy();
        }
      }
    } catch (err) {
      throw err;
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async handleDisabledUsers() {
    try {
      const currentDate = new Date();

      const disabledUsers = await this.userRepository.findAll({ where: { isDisabled: true } });

      for (const value of disabledUsers) {
        const timeDisabled = new Date(value.accountDisableTime);

        const differenceInMilleseconds = currentDate.getTime() - timeDisabled.getTime();

        const minutes = differenceInMilleseconds / (1000 * 60);

        if (minutes >= 15) {
          value.isDisabled = false;
          value.accountDisableTime = null;
          value.save();
          await this.mailSenderService.sendEmail(
            value.email,
            'Account Security',
            '15 minutes had been passed, so your account had removed disable status!',
          );
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
