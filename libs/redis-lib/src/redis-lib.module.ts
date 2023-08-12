import { Module } from '@nestjs/common';
import { RedisLibRepository } from './repositories';
import { RedisLibService } from './services';

@Module({
  providers: [RedisLibService, RedisLibRepository],
  exports: [RedisLibService, RedisLibRepository],
})
export class RedisLibModule {}
