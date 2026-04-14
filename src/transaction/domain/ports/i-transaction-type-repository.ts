import type { TransactionType } from '@transaction/domain/entities/transaction-type';

export interface ITransactionTypeRepository {
  findByCode(code: string): Promise<TransactionType | undefined>;
}
