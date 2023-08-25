import { UserWithoutPassword } from '@app/common-lib/interfaces/request-with-user';
import { MailSenderService } from '@app/notifications-lib';
import { RedisLibRepository } from '@app/redis-lib';
import { UsersLibService } from '@app/users-lib';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SecurityLibService {
  public constructor(
    private readonly mailSenderService: MailSenderService,
    private readonly redisRepository: RedisLibRepository,
    private readonly userLibService: UsersLibService,
  ) {}

  public async handleIncorrectPasswordAttempts(user: UserWithoutPassword) {
    try {
      const { email } = user;
      const formattedKey = `incorrect_password_attempts:${email}`;
      const valueExists = await this.redisRepository.get(formattedKey);
      const timeToLive = await this.redisRepository.getTimeToLive(formattedKey);
      const newValue = Number(valueExists || 0) + 1;
      const newTime = timeToLive === -2 ? 300 : timeToLive;

      if (newValue >= 5) {
        await this.userLibService.disableAccount(user);
        await this.redisRepository.del([formattedKey]);
        await this.mailSenderService.sendEmail(
          email,
          'Account Security',
          'Cause of many incorrect password attempts, your account is disabled for 15 minutes!',
        );
        throw new UnauthorizedException('Your account has been disabled for 15 minutes!');
      } else {
        await this.redisRepository.set(formattedKey, newValue, newTime);
      }
    } catch (err) {
      throw err;
    }
  }
}
