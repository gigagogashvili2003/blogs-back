import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '@app/users-lib';
import { UserJwtPayload } from '@app/utils-lib/interfaces/user-jwt.payload';
import { ACCESS_TOKEN_SECRET, IS_VERIFIED } from '../constants';

@Injectable()
export class IsVerifiedStrategy extends PassportStrategy(Strategy, IS_VERIFIED) {
  constructor(private readonly configService: ConfigService, private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(ACCESS_TOKEN_SECRET),
    });
  }

  public async validate(payload: UserJwtPayload): Promise<any> {
    const user = (await this.userRepository.findUserWithId(payload.userId)).get({ plain: true });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('You must verify your account!');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
