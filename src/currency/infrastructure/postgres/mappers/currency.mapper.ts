import { Currency } from '../../../domain/entities/currency';
import { CurrencyTypeOrmEntity } from '../entities/currency.typeorm-entity';

export class CurrencyMapper {
  /**
   * Maps a Postgres-backed currency row (TypeORM entity) to the domain model.
   */
  public static fromPostgresToDomain(entity: CurrencyTypeOrmEntity): Currency {
    return new Currency(
      entity.id,
      entity.code.toUpperCase(),
      entity.symbol,
      entity.name,
    );
  }
}
