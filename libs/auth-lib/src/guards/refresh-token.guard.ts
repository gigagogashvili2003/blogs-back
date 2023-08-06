import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { REFRESH_TOKEN } from '../constants';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(REFRESH_TOKEN) {}
