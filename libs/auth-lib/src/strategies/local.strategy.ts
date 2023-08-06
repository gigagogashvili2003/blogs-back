import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@app/users-lib';
import { CryptoLibService } from '@app/utils-lib';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly userRepository: UserRepository, private readonly cryptoService: CryptoLibService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  async validate(username: string, password: string): Promise<any> {
    try {
      const user = (await this.userRepository.findUserWithUsername(username)).get({ plain: true });

      if (!user) throw new UnauthorizedException();

      const { password: hashedPassword, ...userWithoutPassword } = user;

      const doesPasswordsMatch = await this.cryptoService.comparePassword(password, hashedPassword);

      if (!doesPasswordsMatch) throw new ConflictException('Invalid Password!');

      return userWithoutPassword;
    } catch (err) {
      throw err;
    }
  }
}
