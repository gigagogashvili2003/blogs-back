import { FileService } from '@app/aws-lib/services';
import { UserWithoutPassword } from '@app/common-lib/interfaces/request-with-user';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
@Injectable()
export class UsersLibService {
  constructor(private readonly fileService: FileService, private readonly userRepository: UserRepository) {}

  async uploadAvatar(user: UserWithoutPassword, file: Express.Multer.File) {
    try {
      const formattedFileName = `${user.username}_${file.fieldname}_${file.originalname}`;
      const url = await this.fileService.upload('blogs-avatars', formattedFileName, file);
      user.avatar = url;
      await user.save();
      return 'You succesfully uploaded your avatar!';
    } catch (err) {
      throw err;
    }
  }

  async deleteAvatar(user: UserWithoutPassword) {
    try {
      user.avatar = null;
      return await user.save();
    } catch (err) {
      throw err;
    }
  }

  async disableAccount(user: UserWithoutPassword) {
    try {
      const { isDisabled } = user;
      if (isDisabled) throw new ConflictException('Account is already disabled!');

      user.isDisabled = true;
      user.accountDisableTime = new Date();
      await user.save();
    } catch (err) {
      throw err;
    }
  }

  async deactivateAccount(user: UserWithoutPassword) {
    try {
      const { isDeactivated } = user;

      if (isDeactivated) throw new ConflictException('Account is already deactivated!');

      user.isDeactivated = true;
      user.accountDeactivationDate = new Date();
      await user.save();

      return 'Your account is deactivated. if you try to sign in the system again, deactivation process will be cancelled, also you can to require cancilation of the decativation from settings.';
    } catch (err) {
      throw err;
    }
  }

  async cancelDeactivation(user: UserWithoutPassword) {
    try {
      const { isDeactivated } = user;

      if (!isDeactivated) throw new ConflictException("Your account isn't deactivated!");

      user.isDeactivated = false;
      user.accountDeactivationDate = null;

      await user.save();

      return 'You succesfully cancelled the deactivation process.';
    } catch (err) {
      throw err;
    }
  }

  async getCurrentUser(id: number) {
    try {
      const user = await this.userRepository.findUserWithId(id, { attributes: { exclude: ['password'] } });
      return { serInfo: user };
    } catch (err) {
      throw err;
    }
  }
}
