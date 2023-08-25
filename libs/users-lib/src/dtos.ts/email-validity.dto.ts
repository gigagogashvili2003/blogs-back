import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class EmailValidityDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;
}
