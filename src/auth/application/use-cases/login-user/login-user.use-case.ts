import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import type { LoginUserRequestDto } from '@auth/application/dtos/login-user/login-user-request.dto';
import {
  LoginUserResponseDto,
  LoginUserResponseUserDto,
} from '@auth/application/dtos/login-user/login-user-response.dto';

import type { JwtPayload } from '@core/strategies/jwt.strategy';

import { USER_REPOSITORY } from '@user/domain/user-repository.token';
import type { IUserRepository } from '@user/domain/ports/i-user-repository';

@Injectable()
export class LoginUserUseCase {
  public constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(
    input: LoginUserRequestDto,
  ): Promise<LoginUserResponseDto> {
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
    const response: LoginUserResponseDto = new LoginUserResponseDto();
    response.accessToken = accessToken;
    const userDto: LoginUserResponseUserDto = new LoginUserResponseUserDto();
    userDto.id = user.id;
    userDto.name = user.name;
    userDto.email = user.email;
    userDto.image = user.image;
    response.user = userDto;
    return response;
  }
}
