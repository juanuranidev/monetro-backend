import type { Transaction } from '../entities/transaction';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
}
