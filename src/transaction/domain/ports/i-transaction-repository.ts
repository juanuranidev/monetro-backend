import type { Transaction } from '@transaction/domain/entities/transaction';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
}
