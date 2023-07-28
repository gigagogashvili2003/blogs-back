import { Module } from '@nestjs/common';
import { UsersLibService } from './users-lib.service';
import { UserRepository } from './repositories';
import { usersProviders } from './providers/users.providers';

@Module({
  providers: [UsersLibService, UserRepository, ...usersProviders],
  exports: [UsersLibService, UserRepository, ...usersProviders],
})
export class UsersLibModule {}
