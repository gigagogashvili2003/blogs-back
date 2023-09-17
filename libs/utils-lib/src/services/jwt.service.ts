import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { UserJwtPayload } from '../interfaces/user-jwt.payload';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '../types/jwt.types';
import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET } from '@app/auth-lib/constants';
@Injectable()
export class JwtService {
  private ACCESS_TOKEN_EXPIRES_IN: string;
  private REFRESH_TOKEN_EXPIRES_IN: string;
  private ACCESS_TOKEN_SECRET: string;
  private REFRESH_TOKEN_SECRET: string;

  public constructor(private readonly jwtService: Jwt, private readonly configService: ConfigService) {
    this.ACCESS_TOKEN_EXPIRES_IN = configService.get<string>(ACCESS_TOKEN_EXPIRES_IN);
    this.REFRESH_TOKEN_EXPIRES_IN = configService.get<string>(REFRESH_TOKEN_EXPIRES_IN);
    this.ACCESS_TOKEN_SECRET = configService.get<string>(ACCESS_TOKEN_SECRET);
    this.REFRESH_TOKEN_SECRET = configService.get<string>(REFRESH_TOKEN_SECRET);
  }

  public async sign(payload: UserJwtPayload, type: TokenType = 'access_token') {
    try {
      let token: string;
      switch (type) {
        case 'access_token':
          token = await this.jwtService.signAsync(payload, {
            expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
            secret: this.ACCESS_TOKEN_SECRET,
          });
          break;
        case 'refresh_token':
          token = await this.jwtService.signAsync(payload, {
            expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
            secret: this.REFRESH_TOKEN_SECRET,
          });
          break;
      }

      return token;
    } catch (err) {
      throw new InternalServerErrorException('Unable to sign jwt!');
    }
  }
}
