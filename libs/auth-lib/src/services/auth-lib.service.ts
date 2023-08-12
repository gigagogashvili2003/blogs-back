import { MailSenderService } from '@app/notifications-lib';
import { UserRepository, UsersLibService } from '@app/users-lib';
import { CreateUserDto } from '@app/users-lib/dtos.ts/create-user.dto';
import { User } from '@app/users-lib/entities/user.entity';
import { CryptoLibService, JwtService, generateOtpCode } from '@app/utils-lib';
import { ConflictException, Injectable } from '@nestjs/common';
import { RedisLibRepository } from '@app/redis-lib';
import { RequestWithUser, UserWithoutPassword } from '@app/common-lib/interfaces/request-with-user';
import { UserJwtPayload } from '@app/utils-lib/interfaces/user-jwt.payload';
import { RefreshTokenRepository } from '@app/users-lib/repositories/refresh-token.repository';
import { IRefreshToken } from '@app/users-lib/interfaces/refresh-token.interface';
import { RefreshToken } from '@app/users-lib/entities/refresh-token.entity';
import { OtpDto } from '@app/users-lib/dtos.ts/otp.dto';

@Injectable()
export class AuthLibService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoLibService,
    private readonly mailSenderService: MailSenderService,
    private readonly jwtService: JwtService,
    private readonly redisRepository: RedisLibRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly usersLibService: UsersLibService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    try {
      const { password, email, username } = createUserDto;

      const userExistsWithEmail = await this.userRepository.findOne({ where: { email } });
      const userExistsWithUsername = await this.userRepository.findOne({ where: { username } });

      if (userExistsWithEmail) throw new ConflictException('User with given email already exists!');
      if (userExistsWithUsername) throw new ConflictException('User with given username already exists!');

      const hashedPassword = await this.cryptoService.hashPassword(password, 10);

      await this.mailSenderService.sendEmail(email, 'Signup Notification', 'You have succesfully signed up');

      await this.userRepository.createUser({
        ...createUserDto,
        password: hashedPassword,
      });

      return 'You succesfully signed up, please verify your account to have full access on website';
    } catch (err) {
      throw err;
    }
  }

  async signin(request: RequestWithUser<User>) {
    try {
      const { id, email, username, isDeactivated } = request.user;

      // Cancel deactivation if deactivated
      if (isDeactivated) {
        await this.usersLibService.cancelDeactivation(request.user);
        await this.mailSenderService.sendEmail(
          email,
          'Account Deactivation',
          'while your account was deactivated, you logged in the system, for that reason account deactivation process has been cancelled.',
        );
      }

      const payload: UserJwtPayload = { userId: id, email, username };

      const accessToken = await this.jwtService.sign(payload);
      const refreshToken = await this.jwtService.sign(payload, 'refresh_token');

      const savedRefreshToken = await this.saveRefreshToken(id, refreshToken);
      request.res.cookie('refresh_token', savedRefreshToken.token, { httpOnly: true });

      return { token: accessToken, userInfo: { ...request.user } };
    } catch (err) {
      throw err;
    }
  }

  async sendVerificationCode(user: UserWithoutPassword) {
    try {
      if (user.isVerified) throw new ConflictException('User is already verified!');
      const { email } = user;
      const otp = generateOtpCode();

      await this.redisRepository.set(email, otp, 900);
      await this.mailSenderService.sendEmail(email, 'Account Verification', `Verification Code: ${otp}, this code is valid for 15 minutes.`);

      return 'Verification code has been sent';
    } catch (err) {
      throw err;
    }
  }

  async verifyAccount(user: UserWithoutPassword, otpDto: OtpDto) {
    try {
      const { email } = user;

      const savedCode = Number(await this.redisRepository.get(email));

      if (!savedCode) throw new ConflictException('There is not any code that is linked to that email');

      if (otpDto.code !== savedCode) throw new ConflictException('Provided otp is wrong');

      user.isVerified = true;
      await user.save();
      await this.redisRepository.del([email]);
      await this.mailSenderService.sendEmail(email, 'Account Verification', 'Your account has been verified!');

      return 'Your account has been verified';
    } catch (err) {
      throw err;
    }
  }

  async saveRefreshToken(userId: number, token: string): Promise<RefreshToken> {
    try {
      const tokenExists = await this.refreshTokenRepository.findOne({ where: { userId } });
      if (tokenExists) return tokenExists;

      const entity: IRefreshToken = { userId, token };

      return await this.refreshTokenRepository.createToken(entity);
    } catch (err) {
      throw err;
    }
  }
  async signout(request: RequestWithUser<User>) {
    try {
      const { id } = request.user;
      await this.refreshTokenRepository.removeToken(id);
      request.res.clearCookie('refresh_token');
      return 'Signed out';
    } catch (err) {
      throw err;
    }
  }

  async removeRefreshToken(id: number) {
    try {
      return await this.refreshTokenRepository.removeToken(id);
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(user: UserWithoutPassword) {
    try {
      const { email, username, id } = user;
      const payload: UserJwtPayload = { email, username, userId: id };
      const accessToken = await this.jwtService.sign(payload);
      return { token: accessToken };
    } catch (err) {
      throw err;
    }
  }

  async ping() {
    try {
      return 'Pong';
    } catch (err) {
      throw err;
    }
  }
}
