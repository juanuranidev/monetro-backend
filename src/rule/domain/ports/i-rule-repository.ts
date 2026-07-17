import type { Rule } from '@rule/domain/entities/rule';
import type { RuleCreateData } from '@rule/domain/ports/types/rule-create-data';
import type { RuleUpdateData } from '@rule/domain/ports/types/rule-update-data';
import type { RuleDeleteOwnedData } from '@rule/domain/ports/types/rule-delete-owned-data';
import type { RuleFindAllByUserIdData } from '@rule/domain/ports/types/rule-find-all-by-user-id-data';
import type { RuleFindOwnedByUserData } from '@rule/domain/ports/types/rule-find-owned-by-user-data';

export interface IRuleRepository {
  create(data: RuleCreateData): Promise<Rule>;

  findAllByUserId(data: RuleFindAllByUserIdData): Promise<readonly Rule[]>;

  findOwnedByUser(data: RuleFindOwnedByUserData): Promise<Rule | undefined>;

  update(data: RuleUpdateData): Promise<Rule>;

  deleteOwned(data: RuleDeleteOwnedData): Promise<void>;
}
