import { Get, Controller } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import { TransactionTypeItemResponseDto } from '@transaction/application/dtos/read-all-transaction-types/transaction-type-item-response.dto';
import { ReadAllTransactionTypesUseCase } from '@transaction/application/use-cases/read-all-transaction-types/read-all-transaction-types.use-case';
import { ReadAllTransactionTypesRequestDto } from '@transaction/application/dtos/read-all-transaction-types/read-all-transaction-types-request.dto';

/** Read-only transaction-type catalog ({@link ReadAllTransactionTypesRequestDto} reserved for future filters). */
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
  public async readAll(): Promise<TransactionTypeItemResponseDto[]> {
    const result = await this.readAllTransactionTypesUseCase.execute(
      new ReadAllTransactionTypesRequestDto(),
    );
    return result.items;
  }
}
