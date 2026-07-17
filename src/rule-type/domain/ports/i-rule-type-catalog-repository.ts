import type { RuleTypeCatalog } from '@rule-type/domain/entities/rule-type-catalog';

import type { RuleTypeFindByIdData } from '@rule-type/domain/ports/types/rule-type-find-by-id-data';

import type { RuleTypeFindByKeyData } from '@rule-type/domain/ports/types/rule-type-find-by-key-data';

export interface IRuleTypeCatalogRepository {
  findAll(): Promise<readonly RuleTypeCatalog[]>;

  findByKey(data: RuleTypeFindByKeyData): Promise<RuleTypeCatalog | undefined>;

  findById(data: RuleTypeFindByIdData): Promise<RuleTypeCatalog | undefined>;
}
