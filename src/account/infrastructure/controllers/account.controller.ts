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
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { GetAccountUseCase } from '@account/application/use-cases/get-account/get-account.use-case';
import { GetAccountsUseCase } from '@account/application/use-cases/get-accounts/get-accounts.use-case';
import { CreateAccountUseCase } from '@account/application/use-cases/create-account/create-account.use-case';
import { UpdateAccountUseCase } from '@account/application/use-cases/update-account/update-account.use-case';
import { GetAccountRequestDto } from '@account/application/dtos/get-account/get-account-request.dto';
import { UpdateAccountBodyDto } from '@account/application/dtos/update-account/update-account-body.dto';
import { CreateAccountBodyDto } from '@account/application/dtos/create-account/create-account-body.dto';
import { GetAccountsRequestDto } from '@account/application/dtos/get-accounts/get-accounts-request.dto';
import { GetAccountsResponseDto } from '@account/application/dtos/get-accounts/get-accounts-response.dto';
import { UpdateAccountRequestDto } from '@account/application/dtos/update-account/update-account-request.dto';
import { CreateAccountRequestDto } from '@account/application/dtos/create-account/create-account-request.dto';
import { CreateAccountResponseDto } from '@account/application/dtos/create-account/create-account-response.dto';

import type { RequestUser } from '@core/strategies/jwt.strategy';

import { GetTransactionsUseCase } from '@transaction/application/use-cases/get-transactions/get-transactions.use-case';
import { GetTransactionsRequestDto } from '@transaction/application/dtos/get-transactions/get-transactions-request.dto';
import { CreateTransactionResponseDto } from '@transaction/application/dtos/create-transaction/create-transaction-response.dto';

import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';

@ApiTags('accounts')
@ApiBearerAuth('access-token')
@Controller('accounts')
export class AccountController {
  public constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getAccountsUseCase: GetAccountsUseCase,
    private readonly getAccountUseCase: GetAccountUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounts for the current user' })
  @ApiOkResponse({ type: GetAccountsResponseDto, isArray: true })
  public getAccounts(
    @CurrentUser() user: RequestUser,
  ): Promise<GetAccountsResponseDto[]> {
    return this.getAccountsUseCase.execute(
      Object.assign(new GetAccountsRequestDto(), { userId: user.userId }),
    );
  }

  @Get(':accountId/transactions')
  @ApiOperation({
    summary: 'List transactions for the current user scoped to one account',
  })
  @ApiParam({ name: 'accountId', format: 'uuid' })
  @ApiOkResponse({ type: CreateTransactionResponseDto, isArray: true })
  public getAccountTransactions(
    @Param('accountId', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<CreateTransactionResponseDto[]> {
    return this.getTransactionsUseCase.execute(
      Object.assign(new GetTransactionsRequestDto(), {
        userId: user.userId,
        accountId,
      }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by id (current user only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: GetAccountsResponseDto })
  public getAccount(
    @Param('id', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<GetAccountsResponseDto> {
    return this.getAccountUseCase.execute(
      Object.assign(new GetAccountRequestDto(), {
        accountId,
        userId: user.userId,
      }),
    );
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
    return this.updateAccountUseCase.execute(
      Object.assign(new UpdateAccountRequestDto(), {
        accountId,
        userId: user.userId,
        body,
      }),
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new account for the current user' })
  @ApiBody({ type: CreateAccountBodyDto })
  @ApiCreatedResponse({ type: CreateAccountResponseDto })
  public create(
    @CurrentUser() user: RequestUser,
    @Body() body: CreateAccountBodyDto,
  ): Promise<CreateAccountResponseDto> {
    return this.createAccountUseCase.execute(
      CreateAccountRequestDto.fromBody(body, user.userId),
    );
  }
}
