import { User } from '../entities/user.entity';

export interface UserRepositoryInterface {
  findUserWithId(id: number): Promise<User>;
  findUserWithEmail(email: string): Promise<User>;
  findUserWithUsername(username: string): Promise<User>;
  findAll(): Promise<Array<User>>;
  createUser(entity: User): Promise<User>;
}
