import { MailSenderService } from '@app/notifications-lib';
import { CreateUserDto } from '@app/users-lib/dtos.ts/create-user.dto';
import { User } from '@app/users-lib/entities/user.entity';
import { CryptoLibService, JwtService, generateOtpCode } from '@app/utils-lib';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RedisLibRepository } from '@app/redis-lib';
import { RequestWithUser, UserWithoutPassword } from '@app/common-lib/interfaces/request-with-user';
import { UserJwtPayload } from '@app/utils-lib/interfaces/user-jwt.payload';
import { RefreshTokenRepository } from '@app/users-lib/repositories/refresh-token.repository';
import { IRefreshToken } from '@app/users-lib/interfaces/refresh-token.interface';
import { RefreshToken } from '@app/users-lib/entities/refresh-token.entity';
import { OtpDto } from '@app/users-lib/dtos.ts/otp.dto';
import { PasswordInstructionsDto } from '@app/users-lib/dtos.ts/forgot-password-instructions.dto';
import { ForgotPasswordDto } from '@app/users-lib/dtos.ts/forgot-password.dto';
import { RedisKeyTypes } from '@app/common-lib/types/redis.types';
import { UserRepositoryInterface } from '@app/users-lib/interfaces/user-repository.interface';
import { USERS_REPOSITORY } from '@app/users-lib/constants/user.constants';

@Injectable()
export class AuthLibService {
  public constructor(
    @Inject(USERS_REPOSITORY) private readonly userRepository: UserRepositoryInterface,
    private readonly cryptoService: CryptoLibService,
    private readonly mailSenderService: MailSenderService,
    private readonly jwtService: JwtService,
    private readonly redisRepository: RedisLibRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async signup(createUserDto: CreateUserDto) {
    try {
      const { password, email, username } = createUserDto;

      const userExistsWithEmail = await this.userRepository.findOne({ where: { email } });
      const userExistsWithUsername = await this.userRepository.findOne({ where: { username } });

      if (userExistsWithEmail) throw new ConflictException('User with given email already exists!');
      if (userExistsWithUsername) throw new ConflictException('User with given username already exists!');

      const hashedPassword = await this.cryptoService.hashPassword(password, 10);

      await this.mailSenderService.sendEmail(email, 'Signup Notification', 'You have succesfully signed up');

      await this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return 'You succesfully signed up, please verify your account to have full access on website';
    } catch (err) {
      throw err;
    }
  }

  public async signin(request: RequestWithUser<User>) {
    try {
      const { id, email, username } = request.user;

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

  public async sendVerificationCode(user: UserWithoutPassword, type: RedisKeyTypes, subject: string) {
    try {
      if (type === RedisKeyTypes.ACCOUNT_VERIFICATION) {
        if (user.isVerified) throw new ConflictException('User is already verified!');
      }
      const { email } = user;
      const otp = generateOtpCode();

      await this.redisRepository.set(type ? `${type}_${email}` : email, otp, 900);
      await this.mailSenderService.sendEmail(email, subject, `Verification Code: ${otp}, this code is valid for 15 minutes.`);

      return 'Verification code has been sent';
    } catch (err) {
      throw err;
    }
  }

  public async verifyAccount(user: UserWithoutPassword, otpDto: OtpDto) {
    try {
      const { email } = user;

      const redisKey = `${RedisKeyTypes.ACCOUNT_VERIFICATION}_${email}`;
      const savedCode = Number(await this.redisRepository.get(redisKey));

      if (!savedCode) throw new ConflictException('There is not any code that is linked to that email');

      if (otpDto.code !== savedCode) throw new ConflictException('Provided otp is wrong');

      user.isVerified = true;
      await user.save();
      await this.redisRepository.del([redisKey]);
      await this.mailSenderService.sendEmail(email, 'Account Verification', 'Your account has been verified!');

      return 'Your account has been verified';
    } catch (err) {
      throw err;
    }
  }

  public async sendForgotPasswordInstructions(passwordInstructionsDto: PasswordInstructionsDto) {
    try {
      const { email } = passwordInstructionsDto;
      const redisKey = `${RedisKeyTypes.PASSWORD_RESET}_${email}`;
      const isAlreadyRequested = await this.redisRepository.get(redisKey);
      if (isAlreadyRequested) throw new ConflictException('You had already required password reset in past 15 minutes!');

      const user = await this.userRepository.findOne({ where: { email }, attributes: { exclude: ['password'] } });
      let message = 'We have sent password reset instructions on the provided email address!';
      if (!user) return { message };

      await this.sendVerificationCode(user, RedisKeyTypes.PASSWORD_RESET, 'Password Reset');
      return { message };
    } catch (err) {
      throw err;
    }
  }

  public async updateForgottenPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const { email, password: newPassword, code: reqCode } = forgotPasswordDto;
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) throw new NotFoundException('User not found!');

      const redisKey = `${RedisKeyTypes.PASSWORD_RESET}_${email}`;
      const code = Number(await this.redisRepository.get(redisKey));
      if (!code) throw new NotFoundException("We cann't find any otp that is linked to this specific users");

      if (code !== reqCode) throw new ConflictException('Wrong OTP');

      const encryptedNewPassword = await this.cryptoService.hashPassword(newPassword);
      user.password = encryptedNewPassword;
      await user.save();

      return 'You succesfully updated password!';
    } catch (err) {
      throw err;
    }
  }

  public async saveRefreshToken(userId: number, token: string): Promise<RefreshToken> {
    try {
      const tokenExists = await this.refreshTokenRepository.findOne({ where: { userId } });
      if (tokenExists) return tokenExists;

      const entity: IRefreshToken = { userId, token };

      return await this.refreshTokenRepository.createToken(entity);
    } catch (err) {
      throw err;
    }
  }
  public async signout(request: RequestWithUser<User>) {
    try {
      const { id } = request.user;
      await this.refreshTokenRepository.removeToken(id);
      request.res.clearCookie('refresh_token');
      return 'Signed out';
    } catch (err) {
      throw err;
    }
  }

  public async removeRefreshToken(id: number) {
    try {
      return await this.refreshTokenRepository.removeToken(id);
    } catch (err) {
      throw err;
    }
  }

  public async refreshToken(user: UserWithoutPassword) {
    try {
      const { email, username, id } = user;
      const payload: UserJwtPayload = { email, username, userId: id };
      const accessToken = await this.jwtService.sign(payload);
      return { token: accessToken };
    } catch (err) {
      throw err;
    }
  }

  public async ping() {
    try {
      return 'Pong';
    } catch (err) {
      throw err;
    }
  }
}
