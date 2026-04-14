import { MoneyAmount } from '@shared/domain/value-objects/money-amount';

import { Transaction } from '@transaction/domain/entities/transaction';
import { TransactionRecordTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction.typeorm-entity';

export class TransactionMapper {
  /**
   * Maps a Postgres-backed transaction row (TypeORM entity) to the domain model.
   */
  public static fromPostgresToDomain(
    entity: TransactionRecordTypeOrmEntity,
  ): Transaction {
    const recordDate: Date = new Date(`${entity.recordDate}T00:00:00.000Z`);
    return new Transaction(
      entity.id,
      MoneyAmount.fromString(entity.amount),
      entity.description,
      recordDate,
      entity.excludeFromStats,
      entity.categoryId,
      entity.transactionTypeId,
      entity.currencyId,
      entity.accountId,
      entity.userId,
    );
  }
}
