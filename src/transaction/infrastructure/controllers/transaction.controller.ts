import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Query,
  HttpCode,
  Controller,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import type { RequestUser } from '@core/strategies/jwt.strategy';

import { GetTransactionsUseCase } from '@transaction/application/use-cases/get-transactions/get-transactions.use-case';
import { GetTransactionsQueryDto } from '@transaction/application/dtos/get-transactions/get-transactions-query.dto';
import { CreateTransactionUseCase } from '@transaction/application/use-cases/create-transaction/create-transaction.use-case';
import { UpdateTransactionUseCase } from '@transaction/application/use-cases/update-transaction/update-transaction.use-case';
import { UpdateTransactionBodyDto } from '@transaction/application/dtos/update-transaction/update-transaction-body.dto';
import { CreateTransactionBodyDto } from '@transaction/application/dtos/create-transaction/create-transaction-body.dto';
import { GetTransactionsRequestDto } from '@transaction/application/dtos/get-transactions/get-transactions-request.dto';
import { UpdateTransactionRequestDto } from '@transaction/application/dtos/update-transaction/update-transaction-request.dto';
import { CreateTransactionRequestDto } from '@transaction/application/dtos/create-transaction/create-transaction-request.dto';
import { CreateTransactionResponseDto } from '@transaction/application/dtos/create-transaction/create-transaction-response.dto';

import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';

@ApiTags('transactions')
@ApiBearerAuth('access-token')
@Controller('transactions')
export class TransactionController {
  public constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List transactions for the current user',
    description:
      'Optional `accountId` filters to postings that hit that account (direct leg or any card tied to it). Optional `creditCardId` restricts to postings on one card — do not combine both.',
  })
  @ApiQuery({
    name: 'accountId',
    required: false,
    description: 'Optional. Filter by account id (must be owned by the user).',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'creditCardId',
    required: false,
    description:
      'Optional. Filter by credit-card posting leg (card must belong to the user).',
    format: 'uuid',
  })
  @ApiOkResponse({ type: CreateTransactionResponseDto, isArray: true })
  public getTransactions(
    @CurrentUser() user: RequestUser,
    @Query() query: GetTransactionsQueryDto,
  ): Promise<CreateTransactionResponseDto[]> {
    return this.getTransactionsUseCase.execute(
      Object.assign(new GetTransactionsRequestDto(), {
        userId: user.userId,
        ...(query.accountId !== undefined ? { accountId: query.accountId } : {}),
        ...(query.creditCardId !== undefined
          ? { creditCardId: query.creditCardId }
          : {}),
      }),
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a financial transaction' })
  @ApiBody({ type: CreateTransactionBodyDto })
  @ApiCreatedResponse({ type: CreateTransactionResponseDto })
  public create(
    @CurrentUser() user: RequestUser,
    @Body() body: CreateTransactionBodyDto,
  ): Promise<CreateTransactionResponseDto> {
    return this.createTransactionUseCase.execute(
      CreateTransactionRequestDto.fromBody(body, user.userId),
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a transaction (current user only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateTransactionBodyDto })
  @ApiOkResponse({ type: CreateTransactionResponseDto })
  public updateTransaction(
    @Param('id', new ParseUUIDPipe({ version: '4' })) transactionId: string,
    @CurrentUser() user: RequestUser,
    @Body() body: UpdateTransactionBodyDto,
  ): Promise<CreateTransactionResponseDto> {
    return this.updateTransactionUseCase.execute(
      Object.assign(new UpdateTransactionRequestDto(), {
        transactionId,
        userId: user.userId,
        body,
      }),
    );
  }
}
