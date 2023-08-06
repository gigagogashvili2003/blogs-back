import { User } from '@app/users-lib/entities/user.entity';
import { Request } from 'express';
export interface RequestWithUser<T extends Omit<User, 'password'>> extends Request {
  user: T;
}
export interface UserWithoutPassword extends Omit<User, 'password'> {}
