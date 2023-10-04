import { AccessTokenGuard } from '@app/auth-lib';
import { RequestWithUser } from '@app/common-lib/interfaces';
import { PostsLibService } from '@app/posts-lib';
import { User } from '@app/users-lib/entities/user.entity';
import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreatePostDto } from 'libs/posts-lib/dtos';

@Controller('posts')
export class PostsController {
  public constructor(private readonly postLibService: PostsLibService) {}

  @Post('create-post')
  @UseGuards(AccessTokenGuard)
  public async createPost(@Body() createPostDto: CreatePostDto, @Req() req: RequestWithUser<User>) {
    await this.postLibService.createPost(createPostDto, req.user);
  }

  @Put('update-post')
  @UseGuards(AccessTokenGuard)
  public async updatePost() {
    await this.postLibService.updatePost();
  }

  @Put('delete-post')
  @UseGuards(AccessTokenGuard)
  public async deletePost() {
    await this.postLibService.deletePost();
  }
}
