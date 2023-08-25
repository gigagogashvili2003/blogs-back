import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@app/users-lib';
import { CryptoLibService } from '@app/utils-lib';
import { LOCAL } from '../constants';
import { SecurityLibService } from '@app/security-lib';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityLibService: SecurityLibService,
    private readonly cryptoService: CryptoLibService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new UnauthorizedException('Invalid Credentials!');

      if (user.isDisabled) {
        throw new ConflictException("You cann't sign in cause your account is disabled for 15 minutes!");
      }

      const { password: hashedPassword, ...userWithoutPassword } = user.dataValues;

      const doesPasswordsMatch = await this.cryptoService.comparePassword(password, hashedPassword);

      if (!doesPasswordsMatch) {
        await this.securityLibService.handleIncorrectPasswordAttempts(user);
        throw new ConflictException('Invalid Password!');
      }

      return userWithoutPassword;
    } catch (err) {
      throw err;
    }
  }
}
