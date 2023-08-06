import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LOCAL } from '../constants';

@Injectable()
export class LocalGuard extends AuthGuard(LOCAL) {}
