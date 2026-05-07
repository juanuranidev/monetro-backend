import { ApiProperty } from '@nestjs/swagger';

import { TransactionTypeItemResponseDto } from '@transaction/application/dtos/read-all-transaction-types/transaction-type-item-response.dto';

/**
 * Output for {@link ReadAllTransactionTypesUseCase}.
 */
export class ReadAllTransactionTypesResponseDto {
  @ApiProperty({ type: TransactionTypeItemResponseDto, isArray: true })
  public items!: TransactionTypeItemResponseDto[];
}
