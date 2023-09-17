import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  birthDate: Date;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
