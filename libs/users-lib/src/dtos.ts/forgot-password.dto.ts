import { IsEmail, IsNumber, IsStrongPassword } from 'class-validator';

export class ForgotPasswordDto {
  @IsNumber()
  code: number;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
