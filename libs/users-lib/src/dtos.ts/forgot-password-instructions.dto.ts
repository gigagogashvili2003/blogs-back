import { IsEmail } from 'class-validator';

export class PasswordInstructionsDto {
  @IsEmail()
  email: string;
}
