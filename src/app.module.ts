import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DbLibModule } from '@app/db-lib';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskLibModule } from '@app/task-lib';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
    ScheduleModule.forRoot(),
    TaskLibModule,
    AuthModule,
    DbLibModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
