import { Inject, Injectable } from '@nestjs/common';
import { REFRESH_TOKEN_REPOSITORY } from '../constants/user.constants';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenRepositoryInterface } from '../interfaces/refresh-token-repository.interface';
import { IRefreshToken } from '../interfaces/refresh-token.interface';
import { RefreshTokenFindOptions } from '../types/refresh-token-repository.types';

@Injectable()
export class RefreshTokenRepository implements RefreshTokenRepositoryInterface {
  constructor(@Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepository: typeof RefreshToken) {}

  public createToken(entity: IRefreshToken) {
    return this.refreshTokenRepository.create({ ...entity });
  }
  public findOne(options?: RefreshTokenFindOptions): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne(options);
  }

  public async removeToken(id: number) {
    const token = await this.findOne({ where: { id } });
    token.token = null;
    return await token.save();
  }
}
