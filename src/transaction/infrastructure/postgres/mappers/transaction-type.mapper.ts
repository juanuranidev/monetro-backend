import { TransactionType } from '../../../domain/entities/transaction-type';
import { TransactionTypeTypeOrmEntity } from '../entities/transaction-type.typeorm-entity';

export class TransactionTypeMapper {
  public static toDomain(
    entity: TransactionTypeTypeOrmEntity,
  ): TransactionType {
    return new TransactionType(entity.id, entity.code.toUpperCase());
  }
}
