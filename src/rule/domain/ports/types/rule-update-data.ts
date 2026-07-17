import type { RuleCreateData } from '@rule/domain/ports/types/rule-create-data';

export interface RuleUpdateData extends RuleCreateData {
  readonly id: string;
}
