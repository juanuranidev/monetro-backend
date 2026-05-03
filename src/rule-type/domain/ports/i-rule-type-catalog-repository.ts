import type { RuleTypeCatalog } from '@rule-type/domain/entities/rule-type-catalog';

export interface IRuleTypeCatalogRepository {
  findAll(): Promise<readonly RuleTypeCatalog[]>;
  findByKey(key: string): Promise<RuleTypeCatalog | undefined>;
  findById(id: string): Promise<RuleTypeCatalog | undefined>;
}
