import type { TransactionType } from '@transaction/domain/entities/transaction-type';
import type { TransactionTypeFindByKeyData } from '@transaction/domain/ports/types/transaction-type-find-by-key-data';

export interface ITransactionTypeRepository {
  findAll(): Promise<readonly TransactionType[]>;

  findByKey(
    data: TransactionTypeFindByKeyData,
  ): Promise<TransactionType | undefined>;
}
