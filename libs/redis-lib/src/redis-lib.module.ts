import { Module } from '@nestjs/common';
import { RedisLibService } from './redis-lib.service';
import { RedisLibRepository } from './repositories';

@Module({
  providers: [RedisLibService, RedisLibRepository],
  exports: [RedisLibService, RedisLibRepository],
})
export class RedisLibModule {}
