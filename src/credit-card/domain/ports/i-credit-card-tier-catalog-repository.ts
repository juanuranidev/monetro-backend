import type { CreditCardTier } from '@credit-card/domain/entities/credit-card-tier';

import type { CreditCardTierFindByKeyData } from '@credit-card/domain/ports/types/credit-card-tier-find-by-key-data';

export interface ICreditCardTierCatalogRepository {
  findAll(): Promise<readonly CreditCardTier[]>;

  findByKey(data: CreditCardTierFindByKeyData): Promise<CreditCardTier | undefined>;
}
