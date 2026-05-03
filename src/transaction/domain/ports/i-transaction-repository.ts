import type {
  Transaction,
  TransactionCreateData,
} from '@transaction/domain/entities/transaction';

export interface ITransactionRepository {
  create(data: TransactionCreateData): Promise<Transaction>;
  findAllByUserId(userId: string): Promise<readonly Transaction[]>;
  findOwnedByUser(
    transactionId: string,
    userId: string,
  ): Promise<Transaction | undefined>;
  update(transaction: Transaction): Promise<Transaction>;
}
