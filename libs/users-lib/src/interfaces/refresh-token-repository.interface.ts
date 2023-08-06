import { RefreshToken } from '../entities/refresh-token.entity';

export interface RefreshTokenRepositoryInterface {
  findWithId(id: number): Promise<RefreshToken>;
  createToken(entity: RefreshToken): Promise<RefreshToken>;
  removeToken(id: number): Promise<RefreshToken>;
}
