import { Module } from '@nestjs/common';
import { TaskLibService } from './task-lib.service';
import { UsersLibModule } from '@app/users-lib';

@Module({
  imports: [UsersLibModule],
  providers: [TaskLibService],
  exports: [TaskLibService],
})
export class TaskLibModule {}
