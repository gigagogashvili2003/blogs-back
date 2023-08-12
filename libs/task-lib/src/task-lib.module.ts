import { Module } from '@nestjs/common';
import { UsersLibModule } from '@app/users-lib';
import { TaskLibService } from './services';

@Module({
  imports: [UsersLibModule],
  providers: [TaskLibService],
  exports: [TaskLibService],
})
export class TaskLibModule {}
