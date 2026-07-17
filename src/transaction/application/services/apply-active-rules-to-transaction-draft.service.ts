import { Inject, Injectable } from '@nestjs/common';

import { RULE_BASE_CATALOG_REPOSITORY } from '@rule-base/domain/rule-base-catalog-repository.token';

import { RULE_TYPE_CATALOG_REPOSITORY } from '@rule-type/domain/rule-type-catalog-repository.token';

import type { IRuleBaseCatalogRepository } from '@rule-base/domain/ports/i-rule-base-catalog-repository';

import type { IRuleTypeCatalogRepository } from '@rule-type/domain/ports/i-rule-type-catalog-repository';

import type { Rule } from '@rule/domain/entities/rule';
import { RULE_REPOSITORY } from '@rule/domain/rule-repository.token';
import type { IRuleRepository } from '@rule/domain/ports/i-rule-repository';
import {
  RuleBaseKey,
  RuleTypeKey,
} from '@rule/application/validation/rule-builtin-keys';

export type TransactionRuleDraftContext = {
  readonly userId: string;
  readonly description: string;
  /** Owning account id for account-based rule matching (use card's account id when posting on a card). */
  readonly accountId: string;
  readonly transactionTypeId: string;
  readonly categoryIds: readonly string[];
  readonly excludeFromStats: boolean;
};

/**
 * Merges active user rules into category ids and exclusion flags for a transaction draft.
 */
@Injectable()
export class ApplyActiveRulesToTransactionDraftService {
  public constructor(
    @Inject(RULE_REPOSITORY)
    private readonly ruleRepository: IRuleRepository,
    @Inject(RULE_TYPE_CATALOG_REPOSITORY)
    private readonly ruleTypeCatalogRepository: IRuleTypeCatalogRepository,
    @Inject(RULE_BASE_CATALOG_REPOSITORY)
    private readonly ruleBaseCatalogRepository: IRuleBaseCatalogRepository,
  ) {}

  public async execute(
    ctx: TransactionRuleDraftContext,
  ): Promise<{ categoryIds: string[]; excludeFromStats: boolean }> {
    let categoryIds: string[] = [...ctx.categoryIds];
    let excludeFromStats: boolean = ctx.excludeFromStats;
    const rules: readonly Rule[] = await this.ruleRepository.findAllByUserId({
      userId: ctx.userId,
    });
    const active: Rule[] = rules
      .filter((r: Rule) => r.isActive)
      .sort((a: Rule, b: Rule) => a.id.localeCompare(b.id));
    for (const rule of active) {
      const typeRow = await this.ruleTypeCatalogRepository.findById({
        id: rule.ruleTypeId,
      });
      const baseRow = await this.ruleBaseCatalogRepository.findById({
        id: rule.ruleBaseId,
      });
      if (typeRow === undefined || baseRow === undefined) {
        continue;
      }
      if (!this.ruleMatches(rule, baseRow.key, ctx)) {
        continue;
      }
      if (typeRow.key === RuleTypeKey.categorization) {
        categoryIds = [
          ...new Set([...categoryIds, ...rule.effectCategoryIds]),
        ].sort();
      } else if (
        typeRow.key === RuleTypeKey.exclusion &&
        rule.excludesFromStats
      ) {
        excludeFromStats = true;
      }
    }
    return { categoryIds, excludeFromStats };
  }

  private ruleMatches(
    rule: Rule,
    baseKey: string,
    ctx: TransactionRuleDraftContext,
  ): boolean {
    const descLower: string = ctx.description.toLowerCase();
    switch (baseKey) {
      case RuleBaseKey.keyword: {
        const p: string = rule.pattern.trim().toLowerCase();
        return p.length >= 1 && descLower.includes(p);
      }
      case RuleBaseKey.account:
        return (
          rule.sourceAccountId !== undefined &&
          rule.sourceAccountId === ctx.accountId
        );
      case RuleBaseKey.category:
        return (
          rule.sourceCategoryId !== undefined &&
          ctx.categoryIds.includes(rule.sourceCategoryId)
        );
      case RuleBaseKey.transaction_type:
        return (
          rule.sourceTransactionTypeId !== undefined &&
          rule.sourceTransactionTypeId === ctx.transactionTypeId
        );
      default:
        return false;
    }
  }
}
