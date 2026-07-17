import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import type { Observable } from 'rxjs';

import { IS_PUBLIC_KEY } from '@core/decorators/public-route.decorator';

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
    user: TUser | false,
    info: unknown,
    context: ExecutionContext,
    status?: number,
  ): TUser {
    void context;
    void status;
    if (err || !user) {
      const reason: string = this.jwtFailureReason(err, info);
      throw err || new UnauthorizedException(reason);
    }
    return user;
  }

  private jwtFailureReason(err: unknown, info: unknown): string {
    if (typeof info === 'string' && info.length > 0) {
      return info;
    }
    if (info instanceof Error && info.message.length > 0) {
      return info.message;
    }
    if (err instanceof Error && err.message.length > 0) {
      return err.message;
    }
    if (info !== null && typeof info === 'object' && 'message' in info) {
      const message: unknown = (info as { readonly message?: unknown }).message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
    }
    return 'Unauthorized';
  }
}
