import type { Rule } from '../entities/rule';

export interface IRuleRepository {
  create(rule: Rule): Promise<Rule>;
}
