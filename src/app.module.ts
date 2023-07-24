import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DbLibModule } from '@app/db-lib';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), DbLibModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
