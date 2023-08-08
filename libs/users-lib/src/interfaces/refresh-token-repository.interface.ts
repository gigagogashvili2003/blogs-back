import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenFindOptions } from '../types/refresh-token-repository.types';

export interface RefreshTokenRepositoryInterface {
  findOne(options?: RefreshTokenFindOptions): Promise<RefreshToken>;
  createToken(entity: RefreshToken): Promise<RefreshToken>;
  removeToken(id: number): Promise<RefreshToken>;
}
