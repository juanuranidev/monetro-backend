import * as bcrypt from 'bcrypt';

import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { RegisterRequestDto } from '@auth/application/dtos/register/register-request.dto';
import { RegisterResponseDto } from '@auth/application/dtos/register/register-response.dto';

import { JwtPayload } from '@core/strategies/jwt.strategy';
import { type User, type UserCreateData } from '@user/domain/entities/user';
import { USER_REPOSITORY } from '@user/domain/user-repository.token';
import type { IUserRepository } from '@user/domain/ports/i-user-repository';

/**
 * Registers a user with email and password, hashes the password (bcrypt), and
 * issues a signed JWT (HS256) for the Authorization: Bearer flow.
 */
@Injectable()
export class RegisterUseCase {
  public constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(
    input: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const name: string = input.name.trim();
    const email: string = input.email.trim().toLowerCase();
    const emailTaken: boolean = await this.userRepository.existsByEmail(email);
    if (emailTaken) {
      throw new ConflictException('This email is already registered');
    }
    const saltRounds: number = this.resolveBcryptSaltRounds();
    const passwordHash: string = await bcrypt.hash(input.password, saltRounds);
    const data: UserCreateData = {
      name,
      email,
      passwordHash,
      authId: undefined,
      image: undefined,
    };
    const saved: User = await this.userRepository.create(data);
    return this.buildResponse(saved);
  }

  private resolveBcryptSaltRounds(): number {
    const fromEnv: string | undefined =
      this.configService.get<string>('BCRYPT_SALT_ROUNDS');
    if (fromEnv === undefined) {
      return 12;
    }
    const parsed: number = Number.parseInt(fromEnv, 10);
    if (Number.isNaN(parsed) || parsed < 10) {
      return 12;
    }
    return Math.min(15, parsed);
  }

  private buildResponse(user: User): RegisterResponseDto {
    const expiresInSeconds: number = this.jwtExpiresSeconds();
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken: string = this.jwtService.sign(payload, {
      expiresIn: expiresInSeconds,
    });
    const r: RegisterResponseDto = new RegisterResponseDto();
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
