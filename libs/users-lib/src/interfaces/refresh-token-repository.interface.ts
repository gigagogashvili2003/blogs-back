import { RefreshToken } from '../entities/refresh-token.entity';

export interface RefreshTokenRepositoryInterface {
  findWithId(id: number): Promise<RefreshToken>;
  findWithToken(token: string): Promise<RefreshToken>;
  createToken(entity: RefreshToken): Promise<RefreshToken>;
}
