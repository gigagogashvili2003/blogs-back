import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthLibModule } from '@app/auth-lib';

@Module({
  imports: [AuthLibModule],
  providers: [],
  controllers: [AuthController],
})
export class AuthModule {}
