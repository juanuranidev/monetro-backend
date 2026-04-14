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
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { AccountEntityDto } from '@account/application/dtos/entity/account-entity.dto';
import { CreateAccountUseCase } from '@account/application/use-cases/create-account/create-account.use-case';
import { CreateAccountRequestDto } from '@account/application/dtos/request/create-account-request.dto';

import type { RequestUser } from '@core/strategies/jwt.strategy';

import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';

@ApiTags('accounts')
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
  @ApiCreatedResponse({ type: AccountEntityDto })
  public create(
    @CurrentUser() user: RequestUser,
    @Body() body: CreateAccountRequestDto,
  ): Promise<AccountEntityDto> {
    return this.createAccountUseCase.execute(user.userId, body);
  }
}
