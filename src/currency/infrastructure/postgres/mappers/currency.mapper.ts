import { Currency } from '../../../domain/entities/currency';
import { CurrencyTypeOrmEntity } from '../entities/currency.typeorm-entity';

export class CurrencyMapper {
  public static toDomain(entity: CurrencyTypeOrmEntity): Currency {
    return new Currency(
      entity.id,
      entity.code.toUpperCase(),
      entity.symbol,
      entity.name,
    );
  }
}
