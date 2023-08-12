import { UserRepository } from '@app/users-lib';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskLibService {
  constructor(private readonly userRepository: UserRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDeactivatedUsersJob() {
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
}
