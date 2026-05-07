import type { TransactionType } from '@transaction/domain/entities/transaction-type';

export interface ITransactionTypeRepository {
  findAll(): Promise<readonly TransactionType[]>;
  findByKey(key: string): Promise<TransactionType | undefined>;
}
