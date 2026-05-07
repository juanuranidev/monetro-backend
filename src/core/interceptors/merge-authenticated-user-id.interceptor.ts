import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';

import type { Observable } from 'rxjs';

import type { RequestUser } from '@core/strategies/jwt.strategy';

/**
 * Injects {@link RequestUser.userId} into the request body so DTOs can require
 * `userId` while keeping it out of the JSON payload. `request.user` is set by
 * {@link JwtStrategy} after validating the JWT and loading the user row.
 */
@Injectable()
export class MergeAuthenticatedUserIdInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      readonly body?: unknown;
      readonly user?: RequestUser;
    }>();
    if (request.user === undefined) {
      return next.handle();
    }
    if (
      request.body === null ||
      request.body === undefined ||
      typeof request.body !== 'object' ||
      Array.isArray(request.body)
    ) {
      return next.handle();
    }
    Object.assign(request.body, { userId: request.user.userId });
    return next.handle();
  }
}
