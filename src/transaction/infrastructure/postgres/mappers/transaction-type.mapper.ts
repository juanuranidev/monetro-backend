import { TransactionType } from '../../../domain/entities/transaction-type';
import { TransactionTypeTypeOrmEntity } from '../entities/transaction-type.typeorm-entity';

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
