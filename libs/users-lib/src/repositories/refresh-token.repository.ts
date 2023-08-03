import { Inject, Injectable } from '@nestjs/common';
import { REFRESH_TOKEN_REPOSITORY } from '../constants/user.constants';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenRepositoryInterface } from '../interfaces/refresh-token-repository.interface';
import { IRefreshToken } from '../interfaces/refresh-token.interface';

@Injectable()
export class RefreshTokenRepository implements RefreshTokenRepositoryInterface {
  constructor(@Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepository: typeof RefreshToken) {}
  async findWithId(id: number): Promise<RefreshToken> {
    return await this.refreshTokenRepository.findOne({ where: { userId: id } });
  }
  findWithToken(token: string): Promise<RefreshToken> {
    throw new Error('Method not implemented.');
  }

  async createToken(entity: IRefreshToken) {
    return await this.refreshTokenRepository.create({ ...entity });
  }
}
