import { User } from '../entities/user.entity';
import { UserFindOptions, UserFindOptionsWhereOmitted } from '../types/user-repository.types';

export interface UserRepositoryInterface {
  findOneWithId(id: number, options?: UserFindOptionsWhereOmitted): Promise<User>;
  findOneWithEmail(email: string): Promise<User>;
  findOneWithUsername(username: string): Promise<User>;
  findOne(options?: UserFindOptions): Promise<User>;
  findAll(options?: UserFindOptions): Promise<Array<User>>;
  create(entity: any): Promise<User>;
}
