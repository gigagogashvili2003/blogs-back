import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from '../constants/user.constants';
import { User } from '../entities/user.entity';
import { UserRepositoryInterface } from '../interfaces/user-repository.interface';
import { FindOptions } from 'sequelize';
import { UserFindOptions, UserFindOptionsWhereOmitted } from '../types/user-repository.types';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(@Inject(USERS_REPOSITORY) private readonly usersRepository: typeof User) {}

  async findUserWithId(id: number, options?: UserFindOptionsWhereOmitted): Promise<User> {
    return await this.usersRepository.findByPk(id, options);
  }

  async findOne(options?: UserFindOptions) {
    return await this.usersRepository.findOne(options);
  }
  async findAll(options?: UserFindOptions): Promise<Array<User>> {
    return await this.usersRepository.findAll(options);
  }
  async createUser(entity: any): Promise<User> {
    return await this.usersRepository.create(entity, { raw: true });
  }
}
