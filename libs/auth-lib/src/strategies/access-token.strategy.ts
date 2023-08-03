import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserJwtPayload } from '@app/utils-lib/interfaces/user-jwt.payload';
import { UserRepository } from '@app/users-lib';
import { IUserResponse } from '@app/users-lib/interfaces/user.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access_token') {
  constructor(private readonly configService: ConfigService, private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  public async validate(payload: UserJwtPayload): Promise<IUserResponse> {
    const user = (await this.userRepository.findUserWithId(payload.userId)).get({ plain: true });

    if (!user) {
      throw new UnauthorizedException();
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
