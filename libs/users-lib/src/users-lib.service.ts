import { FileService } from '@app/aws-lib/services';
import { UserWithoutPassword } from '@app/common-lib/interfaces/request-with-user';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories';

@Injectable()
export class UsersLibService {
  constructor(private readonly fileService: FileService, private readonly userRepository: UserRepository) {}

  async uploadAvatar(user: UserWithoutPassword, file: Express.Multer.File) {
    try {
      const userToUpdate = await this.userRepository.findUserWithId(user.id);
      const formattedFileName = `${user.username}_${file.fieldname}_${file.originalname}`;
      const url = await this.fileService.upload('blogs-avatars', formattedFileName, file);
      userToUpdate.avatar = url;
      await userToUpdate.save();
      return 'You succesfully uploaded your avatar!';
    } catch (err) {
      throw err;
    }
  }

  async deleteAvatar(user: UserWithoutPassword) {
    try {
      const userToUpdate = await this.userRepository.findUserWithId(user.id);
      userToUpdate.avatar = null;
      return await userToUpdate.save();
    } catch (err) {
      throw err;
    }
  }

  async deactivateAccount(user: UserWithoutPassword) {
    try {
      const userToDeactivate = await this.userRepository.findUserWithId(user.id);
      userToDeactivate.isDeactivated = true;
      userToDeactivate.accountDeactivationDate = new Date();
      return await userToDeactivate.save();
    } catch (err) {
      throw err;
    }
  }
}
