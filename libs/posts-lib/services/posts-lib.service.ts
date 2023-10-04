import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos';
import { UserWithoutPassword } from '@app/common-lib/interfaces';

@Injectable()
export class PostsLibService {
  public async createPost(createPostDto: CreatePostDto, user: UserWithoutPassword) {
    console.log(createPostDto);
  }

  public async updatePost() {}

  public async deletePost() {}
}
