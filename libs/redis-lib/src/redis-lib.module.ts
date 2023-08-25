import { Module } from '@nestjs/common';
import { RedisLibRepository } from './repositories';

@Module({
  providers: [RedisLibRepository],
  exports: [RedisLibRepository],
})
export class RedisLibModule {}
