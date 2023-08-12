import { AccessTokenGuard } from '@app/auth-lib';
import { RequestWithUser, UserWithoutPassword } from '@app/common-lib/interfaces/request-with-user';
import { UsersLibService } from '@app/users-lib';
import { Controller, FileTypeValidator, Get, ParseFilePipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('users')
export class UsersController {
  constructor(private readonly usersLibService: UsersLibService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(AccessTokenGuard)
  async uploadAvatar(
    @UploadedFile(new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'image/jpeg' })] }))
    file: Express.Multer.File,
    @Req() request: RequestWithUser<UserWithoutPassword>,
  ) {
    return await this.usersLibService.uploadAvatar(request.user, file);
  }

  @Post('account-deactivate')
  @UseGuards(AccessTokenGuard)
  async deactivateAccount(@Req() request: RequestWithUser<UserWithoutPassword>) {
    return await this.usersLibService.deactivateAccount(request.user);
  }

  @Post('cancel-account-deactivation')
  @UseGuards(AccessTokenGuard)
  async cancelDeactivation(@Req() request: RequestWithUser<UserWithoutPassword>) {
    return await this.usersLibService.cancelDeactivation(request.user);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async getCurrentUser(@Req() request: RequestWithUser<UserWithoutPassword>) {
    return await this.usersLibService.getCurrentUser(request.user.id);
  }
}
