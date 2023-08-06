import { IsNotEmpty, IsNumber } from 'class-validator';

export class OtpDto {
  @IsNumber()
  @IsNotEmpty()
  code: number;
}
