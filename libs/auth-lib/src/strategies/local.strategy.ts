import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@app/users-lib';
import { CryptoLibService } from '@app/utils-lib';
import { LOCAL } from '../constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL) {
  constructor(private readonly userRepository: UserRepository, private readonly cryptoService: CryptoLibService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new UnauthorizedException('Invalid Credentials!');

      const { password: hashedPassword, ...userWithoutPassword } = user.dataValues;

      const doesPasswordsMatch = await this.cryptoService.comparePassword(password, hashedPassword);

      if (!doesPasswordsMatch) throw new ConflictException('Invalid Password!');

      return userWithoutPassword;
    } catch (err) {
      throw err;
    }
  }
}
