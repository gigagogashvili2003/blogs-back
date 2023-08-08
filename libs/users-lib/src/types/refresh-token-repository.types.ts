import { FindOptions } from 'sequelize';
import { RefreshToken } from '../entities/refresh-token.entity';

export type RefreshTokenFindOptions = FindOptions<RefreshToken>;
export type RefreshTokenFindOptionsWhereOmitted = Omit<FindOptions<RefreshToken>, 'where'>;
