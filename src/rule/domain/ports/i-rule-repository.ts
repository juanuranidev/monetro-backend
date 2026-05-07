import type { Rule, RuleCreateData } from '@rule/domain/entities/rule';

export interface IRuleRepository {
  create(data: RuleCreateData): Promise<Rule>;
  findAllByUserId(userId: string): Promise<readonly Rule[]>;
  findOwnedByUser(ruleId: string, userId: string): Promise<Rule | undefined>;
  update(rule: Rule): Promise<Rule>;
  deleteOwned(ruleId: string, userId: string): Promise<void>;
}
