import { MoneyAmount } from '../../../../shared/domain/value-objects/money-amount';
import { Transaction } from '../../../domain/entities/transaction';
import { TransactionRecordTypeOrmEntity } from '../entities/transaction.typeorm-entity';

export class TransactionMapper {
  public static toDomain(entity: TransactionRecordTypeOrmEntity): Transaction {
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
