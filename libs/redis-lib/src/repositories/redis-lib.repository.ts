import { Injectable } from '@nestjs/common';
import { RedisReporitoryInterface } from '../interfaces';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisKey, RedisValue } from '../types';

@Injectable()
export class RedisLibRepository implements RedisReporitoryInterface {
  private redisClient: Redis;
  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
    });
  }
  async get(key: RedisKey): Promise<string> {
    return await this.redisClient.get(key);
  }

  async set(key: RedisKey, value: RedisValue, time: number): Promise<any> {
    return await this.redisClient.set(key, value, 'EX', time || 3600);
  }

  async del(key: RedisKey[]): Promise<number> {
    return await this.redisClient.del(...key);
  }
}
