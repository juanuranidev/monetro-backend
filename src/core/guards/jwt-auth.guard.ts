import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public constructor(private readonly reflector: Reflector) {
    super();
  }

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean | undefined = this.reflector.getAllAndOverride<
      boolean | undefined
    >(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic === true) {
      return true;
    }
    return super.canActivate(context);
  }

  public handleRequest<TUser>(
    err: Error | undefined,
    user: TUser,
    info: Error | undefined,
  ): TUser {
    if (err !== undefined || user === undefined) {
      throw err ?? new UnauthorizedException(info?.message ?? 'Unauthorized');
    }
    return user;
  }
}
