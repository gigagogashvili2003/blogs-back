import { Module } from '@nestjs/common';
import { FileService } from './services';

@Module({
  providers: [FileService],
  exports: [FileService],
})
export class AwsLibModule {}
