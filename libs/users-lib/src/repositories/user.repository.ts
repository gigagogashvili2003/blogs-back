import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from '../constants/user.constants';
import { User } from '../entities/user.entity';
import { UserRepositoryInterface } from '../interfaces/user-repository.interface';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(@Inject(USERS_REPOSITORY) private readonly usersRepository: typeof User) {}

  async findUserWithId(id: number): Promise<User> {
    return await this.usersRepository.findByPk(id);
  }
  async findUserExcludePassword(id: number): Promise<User> {
    return await this.usersRepository.findByPk(id, { attributes: { exclude: ['password'] } });
  }

  async findUserWithEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }
  async findUserWithUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { username } });
  }
  async findAll(): Promise<Array<User>> {
    return await this.usersRepository.findAll();
  }
  async createUser(entity: IUser): Promise<User> {
    return await this.usersRepository.create({ ...entity }, { raw: true });
  }
}
