import { Module } from '@nestjs/common';
import { CryptoLibService, JwtService } from './services';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [CryptoLibService, JwtService],
  exports: [CryptoLibService, JwtService],
})
export class UtilsLibModule {}
