import { CreditCardTier } from '@credit-card/domain/entities/credit-card-tier';

import type { CreditCardTierCatalogTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card-tier-catalog.typeorm-entity';

export class CreditCardTierCatalogMapper {
  public static fromPostgresToDomain(
    row: CreditCardTierCatalogTypeOrmEntity,
  ): CreditCardTier {
    return new CreditCardTier(row.id, row.key, row.displayNameEs);
  }
}
