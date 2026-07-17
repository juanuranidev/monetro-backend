import { Transaction } from '@transaction/domain/entities/transaction';
import { CreateTransactionResponseDto } from '@transaction/application/dtos/create-transaction/create-transaction-response.dto';

/**
 * Maps persisted transaction domain props to API output (XOR on account vs card).
 */
export function mapTransactionToCreateResponseDto(
  saved: Transaction,
): CreateTransactionResponseDto {
  const dto: CreateTransactionResponseDto = Object.assign(
    new CreateTransactionResponseDto(),
    {
      id: saved.id,
      amount: saved.amount.toPersistenceString(),
      description: saved.description,
      recordDate: saved.recordDate.toISOString(),
      excludeFromStats: saved.excludeFromStats,
      categoryIds: [...saved.categoryIds],
      transactionTypeId: saved.transactionTypeId,
      currencyId: saved.currencyId,
    },
  );
  if (saved.accountId !== undefined) {
    Object.assign(dto, { accountId: saved.accountId });
  }
  if (saved.creditCardId !== undefined) {
    Object.assign(dto, { creditCardId: saved.creditCardId });
  }
  return dto;
}
