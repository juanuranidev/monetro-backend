import { TransactionType } from '@transaction/domain/entities/transaction-type';
import { TransactionTypeTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-type.typeorm-entity';

export class TransactionTypeMapper {
  /**
   * Maps a Postgres-backed transaction type row (TypeORM entity) to the domain model.
   */
  public static fromPostgresToDomain(
    entity: TransactionTypeTypeOrmEntity,
  ): TransactionType {
    const keyNormalized: string = entity.key;
    return new TransactionType(
      entity.id,
      keyNormalized,
      entity.displayNameEs.trim().length > 0
        ? entity.displayNameEs
        : keyNormalized,
    );
  }
}
