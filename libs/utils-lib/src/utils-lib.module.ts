import { Module } from '@nestjs/common';
import { CryptoLibService, JwtService } from './services';

@Module({
  providers: [CryptoLibService, JwtService],
  exports: [CryptoLibService, JwtService],
})
export class UtilsLibModule {}
