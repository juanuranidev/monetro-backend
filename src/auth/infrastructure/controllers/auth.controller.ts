import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PublicRoute } from '../../../core/decorators/public-route.decorator';
import { LoginRequestDto } from '../../application/dtos/request/login-request.dto';
import { SignupRequestDto } from '../../application/dtos/request/signup-request.dto';
import { AuthResponseDto } from '../../application/dtos/response/auth-response.dto';
import { LoginUserUseCase } from '../../application/use-cases/login-user/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user/register-user.use-case';

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
  @ApiBody({ type: SignupRequestDto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  public signup(@Body() body: SignupRequestDto): Promise<AuthResponseDto> {
    return this.registerUserUseCase.execute(body);
  }

  @PublicRoute()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate and receive a JWT' })
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({ type: AuthResponseDto })
  public login(@Body() body: LoginRequestDto): Promise<AuthResponseDto> {
    return this.loginUserUseCase.execute(body);
  }
}
