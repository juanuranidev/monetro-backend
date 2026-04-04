import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import type { JwtPayload } from '../../../../core/strategies/jwt.strategy';
import { User } from '../../../../user/domain/entities/user';
import type { IUserRepository } from '../../../../user/domain/ports/i-user-repository';
import { USER_REPOSITORY } from '../../../../user/domain/user-repository.token';
import { AuthResponseDto } from '../../dtos/response/auth-response.dto';
import type { SignupRequestDto } from '../../dtos/request/signup-request.dto';

const BCRYPT_SALT_ROUNDS = 12 as const;

@Injectable()
export class RegisterUserUseCase {
  public constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(input: SignupRequestDto): Promise<AuthResponseDto> {
    const emailNormalized: string = input.email.toLowerCase();
    const exists: boolean =
      await this.userRepository.existsByEmail(emailNormalized);
    if (exists) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash: string = await bcrypt.hash(
      input.password,
      BCRYPT_SALT_ROUNDS,
    );
    const authId: string | undefined =
      input.authId !== undefined && input.authId.trim().length > 0
        ? input.authId.trim()
        : undefined;
    const image: string | undefined =
      input.image !== undefined && input.image.trim().length > 0
        ? input.image.trim()
        : undefined;
    const user: User = new User(
      randomUUID(),
      input.name.trim(),
      emailNormalized,
      passwordHash,
      authId,
      image,
    );
    const saved: User = await this.userRepository.create(user);
    const payload: JwtPayload = {
      sub: saved.id,
      email: saved.email,
    };
    const accessToken: string = await this.jwtService.signAsync(payload);
    const response: AuthResponseDto = new AuthResponseDto();
    response.accessToken = accessToken;
    response.user = {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      image: saved.image,
    };
    return response;
  }
}
