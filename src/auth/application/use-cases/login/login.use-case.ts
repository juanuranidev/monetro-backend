import * as bcrypt from 'bcrypt';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { LoginRequestDto } from '@auth/application/dtos/login/login-request.dto';
import { LoginResponseDto } from '@auth/application/dtos/login/login-response.dto';

import { JwtPayload } from '@core/strategies/jwt.strategy';
import { User } from '@user/domain/entities/user';
import { USER_REPOSITORY } from '@user/domain/user-repository.token';
import type { IUserRepository } from '@user/domain/ports/i-user-repository';

/**
 * Validates email/password against stored bcrypt hash and issues a signed JWT.
 */
@Injectable()
export class LoginUseCase {
  public constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(input: LoginRequestDto): Promise<LoginResponseDto> {
    const email: string = input.email.trim().toLowerCase();
    const user: User | undefined = await this.userRepository.findByEmail(email);
    if (user === undefined) {
      throw this.invalidCredentials();
    }
    if (user.passwordHash === undefined || user.passwordHash.length < 1) {
      throw this.invalidCredentials();
    }
    const passwordOk: boolean = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (passwordOk !== true) {
      throw this.invalidCredentials();
    }
    return this.buildResponse(user);
  }

  private invalidCredentials(): UnauthorizedException {
    return new UnauthorizedException('Invalid email or password');
  }

  private buildResponse(user: User): LoginResponseDto {
    const expiresInSeconds: number = this.jwtExpiresSeconds();
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken: string = this.jwtService.sign(payload, {
      expiresIn: expiresInSeconds,
    });
    const r: LoginResponseDto = new LoginResponseDto();
    r.accessToken = accessToken;
    r.tokenType = 'Bearer';
    r.expiresIn = expiresInSeconds;
    r.user = { id: user.id, name: user.name, email: user.email };
    return r;
  }

  private jwtExpiresSeconds(): number {
    return Number(
      this.configService.get<string>('JWT_EXPIRES_SECONDS', '604800'),
    );
  }
}
