import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { JwtPayload } from '@core/strategies/jwt.strategy';
import type { IUserRepository } from '@user/domain/ports/i-user-repository';
import { USER_REPOSITORY } from '@user/domain/user-repository.token';
import { AuthResponseDto } from '@auth/application/dtos/response/auth-response.dto';
import type { LoginRequestDto } from '@auth/application/dtos/request/login-request.dto';

@Injectable()
export class LoginUserUseCase {
  public constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(input: LoginRequestDto): Promise<AuthResponseDto> {
    const emailNormalized: string = input.email.toLowerCase();
    const user = await this.userRepository.findByEmail(emailNormalized);
    if (user === undefined || user.passwordHash === undefined) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch: boolean = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken: string = await this.jwtService.signAsync(payload);
    const response: AuthResponseDto = new AuthResponseDto();
    response.accessToken = accessToken;
    response.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
    return response;
  }
}
