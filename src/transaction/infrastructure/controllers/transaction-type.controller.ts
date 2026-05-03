import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import { TransactionTypeItemResponseDto } from '@transaction/application/dtos/read-all-transaction-types/transaction-type-item-response.dto';
import { ReadAllTransactionTypesUseCase } from '@transaction/application/use-cases/read-all-transaction-types/read-all-transaction-types.use-case';

@ApiTags('transaction-type')
@ApiBearerAuth('access-token')
@Controller('transaction-type')
export class TransactionTypeController {
  public constructor(
    private readonly readAllTransactionTypesUseCase: ReadAllTransactionTypesUseCase,
  ) {}

  @Get('read-all')
  @ApiOperation({ summary: 'List all transaction types' })
  @ApiOkResponse({ type: TransactionTypeItemResponseDto, isArray: true })
  public readAll(): Promise<TransactionTypeItemResponseDto[]> {
    return this.readAllTransactionTypesUseCase.execute();
  }
}
