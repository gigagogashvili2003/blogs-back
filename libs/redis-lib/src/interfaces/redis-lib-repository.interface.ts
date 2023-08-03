import { RedisKey, RedisValue } from '../types';

export interface RedisReporitoryInterface {
  get(key: RedisKey): Promise<string>;
  set(key: RedisKey, value: RedisValue, time: number): Promise<any>;
  del(key: RedisKey[]): Promise<number>;
}
