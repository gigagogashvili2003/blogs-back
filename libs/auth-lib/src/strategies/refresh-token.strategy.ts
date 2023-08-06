import { UserRepository } from '@app/users-lib';
import { UserJwtPayload } from '@app/utils-lib/interfaces/user-jwt.payload';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh_token') {
  constructor(private readonly configService: ConfigService, private readonly userRepository: UserRepository) {
    super({
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request.cookies['refresh_token'];

          if (!token) {
            return null;
          }
          return token;
        },
      ]),
    });
  }
  async validate(payload: UserJwtPayload) {
    console.log(payload);
    if (payload === null) {
      throw new UnauthorizedException("Refresh token not found in the cookies, or it's not a valid one!");
    }

    const { userId } = payload;
    const user = await this.userRepository.findUserExcludePassword(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...useWithoutPassword } = user;

    return useWithoutPassword;
  }
}
