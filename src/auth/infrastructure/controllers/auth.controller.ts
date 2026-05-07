import { Body, Post, HttpCode, Controller, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { LoginUseCase } from '@auth/application/use-cases/login/login.use-case';
import { LoginBodyDto } from '@auth/application/dtos/login/login-body.dto';
import { RegisterUseCase } from '@auth/application/use-cases/register/register.use-case';
import { RegisterBodyDto } from '@auth/application/dtos/register/register-body.dto';
import { LoginRequestDto } from '@auth/application/dtos/login/login-request.dto';
import { LoginResponseDto } from '@auth/application/dtos/login/login-response.dto';
import { RegisterRequestDto } from '@auth/application/dtos/register/register-request.dto';
import { RegisterResponseDto } from '@auth/application/dtos/register/register-response.dto';

import { PublicRoute } from '@core/decorators/public-route.decorator';

/**
 * Public HTTP endpoints to register and sign in. The returned JWT is intended for
 * `Authorization: Bearer` (e.g. after storing the access token in the client).
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @PublicRoute()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create user with email and password, return JWT',
    description:
      'Passwords are stored as bcrypt hashes. Use the access token in the Authorization header (Bearer) from the client.',
  })
  @ApiBody({ type: RegisterBodyDto })
  @ApiCreatedResponse({ type: RegisterResponseDto })
  public register(@Body() body: RegisterBodyDto): Promise<RegisterResponseDto> {
    return this.registerUseCase.execute(RegisterRequestDto.fromBody(body));
  }

  @PublicRoute()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign in with email and password, return JWT',
  })
  @ApiBody({ type: LoginBodyDto })
  @ApiOkResponse({ type: LoginResponseDto })
  public login(@Body() body: LoginBodyDto): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(LoginRequestDto.fromBody(body));
  }
}
