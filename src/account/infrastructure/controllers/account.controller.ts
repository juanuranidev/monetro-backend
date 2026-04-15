import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  HttpCode,
  Controller,
  HttpStatus,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';

import { GetAccountUseCase } from '@account/application/use-cases/get-account/get-account.use-case';
import { GetAccountsUseCase } from '@account/application/use-cases/get-accounts/get-accounts.use-case';
import { CreateAccountUseCase } from '@account/application/use-cases/create-account/create-account.use-case';
import { UpdateAccountUseCase } from '@account/application/use-cases/update-account/update-account.use-case';
import { GetAccountRequestDto } from '@account/application/dtos/get-account/get-account-request.dto';
import { UpdateAccountBodyDto } from '@account/application/dtos/update-account/update-account-body.dto';
import { GetAccountsRequestDto } from '@account/application/dtos/get-accounts/get-accounts-request.dto';
import { GetAccountsResponseDto } from '@account/application/dtos/get-accounts/get-accounts-response.dto';
import { CreateAccountRequestDto } from '@account/application/dtos/create-account/create-account-request.dto';
import { CreateAccountResponseDto } from '@account/application/dtos/create-account/create-account-response.dto';

import type { RequestUser } from '@core/strategies/jwt.strategy';
import { MergeAuthenticatedUserIdInterceptor } from '@core/interceptors/merge-authenticated-user-id.interceptor';

import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';

@ApiTags('accounts')
@UseInterceptors(MergeAuthenticatedUserIdInterceptor)
@ApiBearerAuth('access-token')
@Controller('accounts')
export class AccountController {
  public constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getAccountsUseCase: GetAccountsUseCase,
    private readonly getAccountUseCase: GetAccountUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
  ) {}

  @Get('admin/test')
  @ApiOperation({ summary: 'Smoke test' })
  @ApiOkResponse({
    schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
  })
  public adminTest(): { readonly ok: boolean } {
    return { ok: true };
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts for the current user' })
  @ApiOkResponse({ type: GetAccountsResponseDto, isArray: true })
  public getAccounts(
    @CurrentUser() user: RequestUser,
  ): Promise<GetAccountsResponseDto[]> {
    const input: GetAccountsRequestDto = new GetAccountsRequestDto();
    input.userId = user.userId;
    return this.getAccountsUseCase.execute(input);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by id (current user only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: GetAccountsResponseDto })
  public getAccount(
    @Param('id', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<GetAccountsResponseDto> {
    const input: GetAccountRequestDto = new GetAccountRequestDto();
    input.accountId = accountId;
    input.userId = user.userId;
    return this.getAccountUseCase.execute(input);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an account (current user only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateAccountBodyDto })
  @ApiOkResponse({ type: CreateAccountResponseDto })
  public updateAccount(
    @Param('id', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @CurrentUser() user: RequestUser,
    @Body() body: UpdateAccountBodyDto,
  ): Promise<CreateAccountResponseDto> {
    return this.updateAccountUseCase.execute({
      accountId,
      userId: user.userId,
      body,
    });
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
