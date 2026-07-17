import type { Transaction } from '@transaction/domain/entities/transaction';
import type { TransactionCreateData } from '@transaction/domain/ports/types/transaction-create-data';
import type { TransactionUpdateData } from '@transaction/domain/ports/types/transaction-update-data';
import type { TransactionCountByAccountData } from '@transaction/domain/ports/types/transaction-count-by-account-data';
import type { TransactionFindAllByUserIdData } from '@transaction/domain/ports/types/transaction-find-all-by-user-id-data';
import type { TransactionFindOwnedByUserData } from '@transaction/domain/ports/types/transaction-find-owned-by-user-data';

export interface ITransactionRepository {
  create(data: TransactionCreateData): Promise<Transaction>;

  findAllByUserId(
    data: TransactionFindAllByUserIdData,
  ): Promise<readonly Transaction[]>;

  findOwnedByUser(
    data: TransactionFindOwnedByUserData,
  ): Promise<Transaction | undefined>;

  update(data: TransactionUpdateData): Promise<Transaction>;

  countByAccountId(data: TransactionCountByAccountData): Promise<number>;
}
