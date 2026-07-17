export interface RuleCreateData {
  readonly name: string;

  readonly isActive: boolean;

  readonly ruleTypeId: string;

  readonly ruleBaseId: string;

  readonly pattern: string;

  readonly sourceAccountId: string | undefined;

  readonly sourceCategoryId: string | undefined;

  readonly sourceTransactionTypeId: string | undefined;

  readonly effectCategoryIds: readonly string[];

  readonly excludesFromStats: boolean;

  readonly userId: string;
}
