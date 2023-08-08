import { User } from '../entities/user.entity';
import { UserFindOptions, UserFindOptionsWhereOmitted } from '../types/user-repository.types';

export interface UserRepositoryInterface {
  findUserWithId(id: number, options?: UserFindOptionsWhereOmitted): Promise<User>;
  findOne(options?: UserFindOptions): Promise<User>;
  findAll(options?: UserFindOptions): Promise<Array<User>>;
  createUser(entity: any): Promise<User>;
}
