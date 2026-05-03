import { BadRequestException } from '@nestjs/common';

import { RuleTypeKey, RuleBaseKey } from '@rule/application/validation/rule-builtin-keys';

type RuleMatchInput = {
  readonly pattern: string;
  readonly sourceAccountId: string | undefined;
  readonly sourceCategoryId: string | undefined;
  readonly sourceTransactionTypeId: string | undefined;
  readonly effectCategoryIds: readonly string[];
  readonly excludesFromStats: boolean;
};

/**
 * Enforces the matrix (rule type × base) for match and effect fields.
 * Catalog keys are normalized lowercase.
 */
export function assertRuleTypeBaseShape(params: {
  readonly ruleTypeKey: string;
  readonly ruleBaseKey: string;
  readonly isPairAllowed: boolean;
} & RuleMatchInput): void {
  if (!params.isPairAllowed) {
    throw new BadRequestException(
      'This rule base is not allowed for the selected rule type',
    );
  }
  const t: string = params.ruleTypeKey.trim().toLowerCase();
  const b: string = params.ruleBaseKey.trim().toLowerCase();
  if (b === RuleBaseKey.keyword) {
    if (params.pattern.trim().length < 1) {
      throw new BadRequestException('pattern is required for keyword rules');
    }
  } else {
    if (params.pattern.trim().length > 0) {
      throw new BadRequestException('pattern is only used for keyword rules');
    }
  }
  if (b === RuleBaseKey.account) {
    if (params.sourceAccountId === undefined) {
      throw new BadRequestException(
        'sourceAccountId is required for account-based rules',
      );
    }
  } else if (params.sourceAccountId !== undefined) {
    throw new BadRequestException('sourceAccountId is only for account base');
  }
  if (b === RuleBaseKey.category) {
    if (params.sourceCategoryId === undefined) {
      throw new BadRequestException(
        'sourceCategoryId is required for category-based rules',
      );
    }
  } else if (params.sourceCategoryId !== undefined) {
    throw new BadRequestException(
      'sourceCategoryId is only for category base (match on category)',
    );
  }
  if (b === RuleBaseKey.transaction_type) {
    if (params.sourceTransactionTypeId === undefined) {
      throw new BadRequestException(
        'matched transaction type is required for transaction_type rules',
      );
    }
  } else if (params.sourceTransactionTypeId !== undefined) {
    throw new BadRequestException(
      'transaction type is only for transaction_type base',
    );
  }
  if (t === RuleTypeKey.categorization) {
    if (params.effectCategoryIds.length < 1) {
      throw new BadRequestException(
        'Categorization rules need at least one effectCategoryId to apply when matched',
      );
    }
    if (params.excludesFromStats) {
      throw new BadRequestException(
        'excludesFromStats is only for exclusion rules',
      );
    }
  }
  if (t === RuleTypeKey.exclusion) {
    if (params.effectCategoryIds.length > 0) {
      throw new BadRequestException(
        'exclusion rules do not use effectCategoryIds',
      );
    }
  }
}
