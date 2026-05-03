import type { RuleBaseCatalog } from '@rule-base/domain/entities/rule-base-catalog';

export interface IRuleBaseCatalogRepository {
  findAll(): Promise<readonly RuleBaseCatalog[]>;
  findByKey(key: string): Promise<RuleBaseCatalog | undefined>;
  findById(id: string): Promise<RuleBaseCatalog | undefined>;
  findAllByRuleTypeKey(ruleTypeKey: string): Promise<readonly RuleBaseCatalog[]>;
  isPairAllowed(ruleTypeKey: string, ruleBaseKey: string): Promise<boolean>;
}
