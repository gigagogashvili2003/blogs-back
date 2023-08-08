import { Inject, Injectable } from '@nestjs/common';
import { REFRESH_TOKEN_REPOSITORY } from '../constants/user.constants';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenRepositoryInterface } from '../interfaces/refresh-token-repository.interface';
import { IRefreshToken } from '../interfaces/refresh-token.interface';
import { RefreshTokenFindOptions } from '../types/refresh-token-repository.types';

@Injectable()
export class RefreshTokenRepository implements RefreshTokenRepositoryInterface {
  constructor(@Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepository: typeof RefreshToken) {}

  async createToken(entity: IRefreshToken) {
    return await this.refreshTokenRepository.create({ ...entity });
  }
  async findOne(options?: RefreshTokenFindOptions): Promise<RefreshToken> {
    return await this.refreshTokenRepository.findOne(options);
  }

  async removeToken(id: number) {
    const token = await this.findOne({ where: { id } });
    token.token = null;
    return await token.save();
  }
}
