import { UserRepository } from '@app/users-lib';
import { CreateUserDto } from '@app/users-lib/dtos.ts/create-user.dto';
import { User } from '@app/users-lib/entities/user.entity';
import { UserRole } from '@app/users-lib/enums/user.enums';
import { CryptoLibService, JwtService } from '@app/utils-lib';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthLibService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoLibService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password } = createUserDto;

      const hashedPassword = await this.cryptoService.hashPassword(password, 10);
      return await this.userRepository.createUser({
        ...createUserDto,
        password: hashedPassword,
        role: UserRole.USER,
        isVerified: false,
      });
    } catch (err) {
      throw err;
    }
  }

  async signin() {
    try {
      return 'HELLO';
    } catch (err) {}
  }

  async validateUser(username: string, password: string) {
    try {
      const user = (await this.userRepository.findUserWithUsername(username)).get({ plain: true });

      if (!user) throw new NotFoundException('User Not Found!');

      const { password: hashedPassword, ...userWithoutPassword } = user;

      const doesPasswordsMatch = await this.cryptoService.comparePassword(password, hashedPassword);

      if (!doesPasswordsMatch) throw new ConflictException('Invalid Password!');

      return userWithoutPassword;
    } catch (err) {
      throw err;
    }
  }
}
