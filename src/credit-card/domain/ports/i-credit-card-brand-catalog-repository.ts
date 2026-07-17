import type { CreditCardBrand } from '@credit-card/domain/entities/credit-card-brand';

import type { CreditCardBrandFindByKeyData } from '@credit-card/domain/ports/types/credit-card-brand-find-by-key-data';

export interface ICreditCardBrandCatalogRepository {
  findAll(): Promise<readonly CreditCardBrand[]>;

  findByKey(data: CreditCardBrandFindByKeyData): Promise<CreditCardBrand | undefined>;
}
