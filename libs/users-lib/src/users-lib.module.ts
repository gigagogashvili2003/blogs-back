import { Module } from '@nestjs/common';
import { UsersLibService } from './users-lib.service';
import { UserRepository } from './repositories';
import { usersProviders } from './providers/users.providers';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

@Module({
  providers: [UsersLibService, UserRepository, RefreshTokenRepository, ...usersProviders],
  exports: [UsersLibService, UserRepository, RefreshTokenRepository, ...usersProviders],
})
export class UsersLibModule {}
