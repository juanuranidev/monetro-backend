import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { Strategy, ExtractJwt } from 'passport-jwt';

import { USER_REPOSITORY } from '@user/domain/user-repository.token';
import type { IUserRepository } from '@user/domain/ports/i-user-repository';

export type JwtPayload = {
  readonly sub: string;
  readonly email: string;
};

/**
 * Authenticated user attached to `request.user` after JWT validation and DB load.
 */
export type RequestUser = {
  readonly userId: string;
  readonly email: string;
  readonly name: string;
  readonly authId: string | undefined;
  readonly image: string | undefined;
};

const bearerExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();

function jwtFromRequestWithTrim(req: Parameters<typeof bearerExtractor>[0]): string | null {
  const raw: string | null = bearerExtractor(req);
  if (raw === null) {
    return null;
  }
  const trimmed: string = raw.trim();
  return trimmed.length === 0 ? null : trimmed;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  public constructor(
    configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: jwtFromRequestWithTrim,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  public async validate(payload: JwtPayload): Promise<RequestUser> {
    const user = await this.userRepository.findById(payload.sub);
    if (user === undefined) {
      throw new UnauthorizedException('User not found');
    }
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      authId: user.authId,
      image: user.image,
    };
  }
}
