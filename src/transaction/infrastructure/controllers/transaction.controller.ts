import {
  Get,
  Body,
  Post,
  Patch,
  Param,
  HttpCode,
  Controller,
  HttpStatus,
  UseInterceptors,
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

import type { RequestUser } from '@core/strategies/jwt.strategy';
import { MergeAuthenticatedUserIdInterceptor } from '@core/interceptors/merge-authenticated-user-id.interceptor';
import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';

import { CreateTransactionUseCase } from '@transaction/application/use-cases/create-transaction/create-transaction.use-case';
import { GetTransactionsUseCase } from '@transaction/application/use-cases/get-transactions/get-transactions.use-case';
import { UpdateTransactionUseCase } from '@transaction/application/use-cases/update-transaction/update-transaction.use-case';
import { CreateTransactionRequestDto } from '@transaction/application/dtos/create-transaction/create-transaction-request.dto';
import { CreateTransactionResponseDto } from '@transaction/application/dtos/create-transaction/create-transaction-response.dto';
import { GetTransactionsRequestDto } from '@transaction/application/dtos/get-transactions/get-transactions-request.dto';
import { UpdateTransactionBodyDto } from '@transaction/application/dtos/update-transaction/update-transaction-body.dto';

@ApiTags('transactions')
@UseInterceptors(MergeAuthenticatedUserIdInterceptor)
@ApiBearerAuth('access-token')
@Controller('transactions')
export class TransactionController {
  public constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
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
  @ApiOperation({ summary: 'List transactions for the current user' })
  @ApiOkResponse({ type: CreateTransactionResponseDto, isArray: true })
  public getTransactions(
    @CurrentUser() user: RequestUser,
  ): Promise<CreateTransactionResponseDto[]> {
    const input: GetTransactionsRequestDto = new GetTransactionsRequestDto();
    input.userId = user.userId;
    return this.getTransactionsUseCase.execute(input);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a financial transaction' })
  @ApiBody({ type: CreateTransactionRequestDto })
  @ApiCreatedResponse({ type: CreateTransactionResponseDto })
  public create(
    @Body() body: CreateTransactionRequestDto,
  ): Promise<CreateTransactionResponseDto> {
    return this.createTransactionUseCase.execute(body);
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
    return this.updateTransactionUseCase.execute({
      transactionId,
      userId: user.userId,
      body,
    });
  }
}
