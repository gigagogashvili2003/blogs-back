import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IsVerifiedGuard extends AuthGuard('is_verified') {}
