import { Module } from '@nestjs/common';
import { PostsLibService } from '../services';

@Module({
  providers: [PostsLibService],
  exports: [PostsLibService],
})
export class PostsLibModule {}
