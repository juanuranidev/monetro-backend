import {
  Get,
  Body,
  Post,
  HttpCode,
  Controller,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { LoginUserUseCase } from '@auth/application/use-cases/login-user/login-user.use-case';
import { LoginUserRequestDto } from '@auth/application/dtos/login-user/login-user-request.dto';
import { RegisterUserUseCase } from '@auth/application/use-cases/register-user/register-user.use-case';
import { LoginUserResponseDto } from '@auth/application/dtos/login-user/login-user-response.dto';
import { RegisterUserRequestDto } from '@auth/application/dtos/register-user/register-user-request.dto';
import { RegisterUserResponseDto } from '@auth/application/dtos/register-user/register-user-response.dto';

import { PublicRoute } from '@core/decorators/public-route.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @PublicRoute()
  @Get('admin/test')
  @ApiOperation({ summary: 'Smoke test' })
  @ApiOkResponse({
    schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
  })
  public adminTest(): { readonly ok: boolean } {
    return { ok: true };
  }

  @PublicRoute()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({ type: RegisterUserRequestDto })
  @ApiCreatedResponse({ type: RegisterUserResponseDto })
  public signup(
    @Body() body: RegisterUserRequestDto,
  ): Promise<RegisterUserResponseDto> {
    return this.registerUserUseCase.execute(body);
  }

  @PublicRoute()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate and receive a JWT' })
  @ApiBody({ type: LoginUserRequestDto })
  @ApiOkResponse({ type: LoginUserResponseDto })
  public login(
    @Body() body: LoginUserRequestDto,
  ): Promise<LoginUserResponseDto> {
    return this.loginUserUseCase.execute(body);
  }
}
