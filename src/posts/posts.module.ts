import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsLibModule } from '@app/posts-lib';

@Module({
  imports: [PostsModule, PostsLibModule],
  controllers: [PostsController],
})
export class PostsModule {}
