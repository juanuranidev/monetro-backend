import { MoneyAmount } from '@shared/domain/value-objects/money-amount';

import { Transaction } from '@transaction/domain/entities/transaction';
import { TransactionRecordTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction.typeorm-entity';

export class TransactionMapper {
  /**
   * Maps a Postgres-backed transaction row and its category id list to the domain model.
   */
  public static fromPostgresToDomain(
    entity: TransactionRecordTypeOrmEntity,
    categoryIds: readonly string[],
  ): Transaction {
    const recordDate: Date =
      entity.recordDate instanceof Date
        ? entity.recordDate
        : new Date(entity.recordDate);
    return new Transaction(
      entity.id,
      MoneyAmount.fromString(entity.amount),
      entity.description,
      recordDate,
      entity.excludeFromStats,
      categoryIds,
      entity.transactionTypeId,
      entity.currencyId,
      entity.accountId,
    );
  }
}
