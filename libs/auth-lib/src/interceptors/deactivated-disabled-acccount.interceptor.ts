import { MailSenderService } from '@app/notifications-lib';
import { UserRepository, UsersLibService } from '@app/users-lib';
import { CallHandler, ConflictException, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class DeactivatedDisabledAccountInterceptor implements NestInterceptor {
  constructor(
    private readonly usersLibService: UsersLibService,
    private readonly userRepository: UserRepository,
    private readonly mailSenderService: MailSenderService,
  ) {}

  public async intercept(context: ExecutionContext, next: CallHandler) {
    const { user: reqUser } = context.switchToHttp().getRequest();
    const user = await this.userRepository.findUserWithId(reqUser.id);

    if (user.isDeactivated) {
      await this.usersLibService.cancelDeactivation(user);
      await this.mailSenderService.sendEmail(
        user.email,
        'Account Deactivation',
        'while your account was deactivated, you logged in the system, for that reason account deactivation process has been cancelled.',
      );
    }

    if (user.isDisabled) {
      throw new ConflictException("You cann't sign in cause account is disabled for 15 minutes!");
    }

    return next.handle();
  }
}
