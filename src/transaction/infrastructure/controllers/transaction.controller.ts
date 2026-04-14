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

import type { RequestUser } from '@core/strategies/jwt.strategy';

import { TransactionEntityDto } from '@transaction/application/dtos/entity/transaction-entity.dto';
import { CreateTransactionUseCase } from '@transaction/application/use-cases/create-transaction/create-transaction.use-case';
import { CreateTransactionRequestDto } from '@transaction/application/dtos/request/create-transaction-request.dto';

import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';

@ApiTags('transactions')
@ApiBearerAuth('access-token')
@Controller('transactions')
export class TransactionController {
  public constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
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
  @ApiOperation({ summary: 'Register a financial transaction' })
  @ApiBody({ type: CreateTransactionRequestDto })
  @ApiCreatedResponse({ type: TransactionEntityDto })
  public create(
    @CurrentUser() user: RequestUser,
    @Body() body: CreateTransactionRequestDto,
  ): Promise<TransactionEntityDto> {
    return this.createTransactionUseCase.execute(user.userId, body);
  }
}
