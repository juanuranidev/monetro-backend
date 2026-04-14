import { TransactionType } from '@transaction/domain/entities/transaction-type';
import { TransactionTypeTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-type.typeorm-entity';

export class TransactionTypeMapper {
  /**
   * Maps a Postgres-backed transaction type row (TypeORM entity) to the domain model.
   */
  public static fromPostgresToDomain(
    entity: TransactionTypeTypeOrmEntity,
  ): TransactionType {
    return new TransactionType(entity.id, entity.code.toUpperCase());
  }
}
