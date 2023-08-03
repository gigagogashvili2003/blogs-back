import { REFRESH_TOKEN_REPOSITORY, USERS_REPOSITORY } from '../constants/user.constants';
import { RefreshToken } from '../entities/refresh-token.entity';
import { User } from '../entities/user.entity';

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useValue: User,
  },
  {
    provide: REFRESH_TOKEN_REPOSITORY,
    useValue: RefreshToken,
  },
];
