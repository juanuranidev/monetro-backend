import type { RuleBaseCatalog } from '@rule-base/domain/entities/rule-base-catalog';

import type { RuleBaseFindByIdData } from '@rule-base/domain/ports/types/rule-base-find-by-id-data';

import type { RuleBaseFindByKeyData } from '@rule-base/domain/ports/types/rule-base-find-by-key-data';

import type { RuleBaseIsPairAllowedData } from '@rule-base/domain/ports/types/rule-base-is-pair-allowed-data';

import type { RuleBaseFindAllByRuleTypeKeyData } from '@rule-base/domain/ports/types/rule-base-find-all-by-rule-type-key-data';

export interface IRuleBaseCatalogRepository {
  findAll(): Promise<readonly RuleBaseCatalog[]>;

  findByKey(data: RuleBaseFindByKeyData): Promise<RuleBaseCatalog | undefined>;

  findById(data: RuleBaseFindByIdData): Promise<RuleBaseCatalog | undefined>;

  findAllByRuleTypeKey(
    data: RuleBaseFindAllByRuleTypeKeyData,
  ): Promise<readonly RuleBaseCatalog[]>;

  isPairAllowed(data: RuleBaseIsPairAllowedData): Promise<boolean>;
}
