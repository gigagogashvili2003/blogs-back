import { FindOptions } from 'sequelize';
import { User } from '../entities/user.entity';

export type UserFindOptionsWhereOmitted = Omit<FindOptions<User>, 'where'>;
export type UserFindOptions = FindOptions<User>;
