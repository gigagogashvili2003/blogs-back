import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACCESS_TOKEN } from '../constants';

@Injectable()
export class AccessTokenGuard extends AuthGuard(ACCESS_TOKEN) {}
