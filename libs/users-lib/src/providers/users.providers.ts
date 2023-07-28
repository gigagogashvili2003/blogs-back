import { USERS_REPOSITORY } from '../constants/user.constants';
import { User } from '../entities/user.entity';

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useValue: User,
  },
];
