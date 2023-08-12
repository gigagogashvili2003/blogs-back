import { Module } from '@nestjs/common';
import { RefreshTokenRepository, UserRepository } from './repositories';
import { AwsLibModule } from '@app/aws-lib';
import { UsersLibService } from './services';
import { usersProviders } from './providers';

@Module({
  imports: [AwsLibModule],
  providers: [UsersLibService, UserRepository, RefreshTokenRepository, ...usersProviders],
  exports: [UsersLibService, UserRepository, RefreshTokenRepository, ...usersProviders],
})
export class UsersLibModule {}
