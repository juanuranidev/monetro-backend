import type { TransactionType } from '../entities/transaction-type';

export interface ITransactionTypeRepository {
  findByCode(code: string): Promise<TransactionType | undefined>;
}
