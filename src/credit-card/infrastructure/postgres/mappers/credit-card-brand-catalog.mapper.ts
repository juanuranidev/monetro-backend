import { CreditCardBrand } from '@credit-card/domain/entities/credit-card-brand';

import type { CreditCardBrandCatalogTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card-brand-catalog.typeorm-entity';

export class CreditCardBrandCatalogMapper {
  public static fromPostgresToDomain(
    row: CreditCardBrandCatalogTypeOrmEntity,
  ): CreditCardBrand {
    return new CreditCardBrand(row.id, row.key, row.displayNameEs);
  }
}
