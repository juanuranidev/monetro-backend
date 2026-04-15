import {
  Get,
  Body,
  Post,
  HttpCode,
  Controller,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { CreateAccountUseCase } from '@account/application/use-cases/create-account/create-account.use-case';
import { CreateAccountRequestDto } from '@account/application/dtos/create-account/create-account-request.dto';
import { CreateAccountResponseDto } from '@account/application/dtos/create-account/create-account-response.dto';

import { MergeAuthenticatedUserIdInterceptor } from '@core/interceptors/merge-authenticated-user-id.interceptor';

@ApiTags('accounts')
@UseInterceptors(MergeAuthenticatedUserIdInterceptor)
@ApiBearerAuth('access-token')
@Controller('accounts')
export class AccountController {
  public constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
  ) {}

  @Get('admin/test')
  @ApiOperation({ summary: 'Smoke test' })
  @ApiOkResponse({
    schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
  })
  public adminTest(): { readonly ok: boolean } {
    return { ok: true };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new account for the current user' })
  @ApiBody({ type: CreateAccountRequestDto })
  @ApiCreatedResponse({ type: CreateAccountResponseDto })
  public create(
    @Body() body: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    return this.createAccountUseCase.execute(body);
  }
}
