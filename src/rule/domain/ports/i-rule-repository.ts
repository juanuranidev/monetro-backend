import type { Rule } from '@rule/domain/entities/rule';

export interface IRuleRepository {
  create(rule: Rule): Promise<Rule>;
}
