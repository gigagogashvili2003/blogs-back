import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from '../constants/user.constants';
import { User } from '../entities/user.entity';
import { UserRepositoryInterface } from '../interfaces/user-repository.interface';
import { UserFindOptions, UserFindOptionsWhereOmitted } from '../types/user-repository.types';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  public constructor(@Inject(USERS_REPOSITORY) private readonly usersRepository: typeof User) {}

  public findOneWithId(id: number, options?: UserFindOptionsWhereOmitted): Promise<User> {
    return this.usersRepository.findByPk(id, options);
  }
  public findOneWithEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }
  public findOneWithUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  public findOne(options?: UserFindOptions) {
    return this.usersRepository.findOne(options);
  }
  public findAll(options?: UserFindOptions): Promise<Array<User>> {
    return this.usersRepository.findAll(options);
  }
  public create(entity: any): Promise<User> {
    return this.usersRepository.create(entity, { raw: true });
  }
}
