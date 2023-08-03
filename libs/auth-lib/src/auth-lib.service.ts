import { MailSenderService } from '@app/notifications-lib';
import { UserRepository } from '@app/users-lib';
import { CreateUserDto } from '@app/users-lib/dtos.ts/create-user.dto';
import { User } from '@app/users-lib/entities/user.entity';
import { UserRole } from '@app/users-lib/enums/user.enums';
import { CryptoLibService, JwtService, generateOtpCode } from '@app/utils-lib';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RedisLibRepository } from '@app/redis-lib';
import { RequestWithUser } from '@app/common-lib/interfaces/request-with-user';
import { UserJwtPayload } from '@app/utils-lib/interfaces/user-jwt.payload';
import { RefreshTokenRepository } from '@app/users-lib/repositories/refresh-token.repository';
import { IRefreshToken } from '@app/users-lib/interfaces/refresh-token.interface';
import { RefreshToken } from '@app/users-lib/entities/refresh-token.entity';

@Injectable()
export class AuthLibService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoLibService,
    private readonly mailSenderService: MailSenderService,
    private readonly jwtService: JwtService,
    private readonly redisRepository: RedisLibRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, email, username } = createUserDto;

      const userExistsWithEmail = await this.userRepository.findUserWithEmail(email);
      const userExistsWithUsername = await this.userRepository.findUserWithUsername(username);

      if (userExistsWithEmail) throw new ConflictException('User with given email already exists!');
      if (userExistsWithUsername) throw new ConflictException('User with given username already exists!');

      const hashedPassword = await this.cryptoService.hashPassword(password, 10);

      await this.mailSenderService.sendEmail(email, 'Signup Notification', 'You have succesfully signed up');

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

  async signin(request: RequestWithUser<User>) {
    try {
      const { id, email, username } = request.user;
      const payload: UserJwtPayload = {
        userId: id,
        email,
        username,
      };

      const accessToken = await this.jwtService.sign(payload);
      const refreshToken = await this.jwtService.sign(payload, 'refresh_token');

      const savedRefreshToken = await this.saveRefreshToken(id, refreshToken);
      request.res.cookie('refresh_token', savedRefreshToken.token, { httpOnly: true });

      return {
        token: accessToken,
        userInfo: {
          ...request.user,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async saveRefreshToken(userId: number, token: string): Promise<RefreshToken> {
    try {
      const tokenExists = (await this.refreshTokenRepository.findWithId(userId)).get({ plain: true });
      if (tokenExists) return tokenExists;

      const entity: IRefreshToken = {
        userId,
        token,
      };

      return await this.refreshTokenRepository.createToken(entity);
    } catch (err) {
      throw err;
    }
  }

  // Local Strategy
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
