import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoLibService {
  public async genSalt(salt: number): Promise<string> {
    try {
      return await bcrypt.genSalt(salt);
    } catch (err) {
      throw new InternalServerErrorException('Unable to generate salt value!');
    }
  }

  public async hashPassword(password: string, salt: number = 10): Promise<string> {
    try {
      const saltValue = await this.genSalt(salt);
      const hashedPassword = await bcrypt.hash(password, saltValue);

      return hashedPassword;
    } catch (err) {
      throw new InternalServerErrorException('Error during the hash of password!');
    }
  }

  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
      throw new InternalServerErrorException('Error during the compare of passwords!');
    }
  }
}
