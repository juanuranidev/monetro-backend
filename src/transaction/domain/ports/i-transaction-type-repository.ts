import type { TransactionType } from '@transaction/domain/entities/transaction-type';

export interface ITransactionTypeRepository {
  findAll(): Promise<readonly TransactionType[]>;
  findByCode(code: string): Promise<TransactionType | undefined>;
}
