import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_VERIFIED } from '../constants';

@Injectable()
export class IsVerifiedGuard extends AuthGuard(IS_VERIFIED) {}
