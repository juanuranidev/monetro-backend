import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { RULE_BASE_CATALOG_REPOSITORY } from '@rule-base/domain/rule-base-catalog-repository.token';

import { RULE_TYPE_CATALOG_REPOSITORY } from '@rule-type/domain/rule-type-catalog-repository.token';

import type { IRuleBaseCatalogRepository } from '@rule-base/domain/ports/i-rule-base-catalog-repository';

import type { IRuleTypeCatalogRepository } from '@rule-type/domain/ports/i-rule-type-catalog-repository';

import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';

import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';

import { Rule } from '@rule/domain/entities/rule';
import { RULE_REPOSITORY } from '@rule/domain/rule-repository.token';
import { RuleToResourceMapper } from '@rule/application/mappers/rule-to-resource.mapper';
import type { IRuleRepository } from '@rule/domain/ports/i-rule-repository';
import { assertRuleTypeBaseShape } from '@rule/application/validation/rule-input-validator';
import { RuleResourceResponseDto } from '@rule/application/dtos/rule-resource/rule-resource-response.dto';
import type { UpdateRuleRequestDto } from '@rule/application/dtos/update-rule/update-rule-request.dto';
import {
  RuleBaseKey,
  RuleTypeKey,
} from '@rule/application/validation/rule-builtin-keys';

import type { TransactionTypeKeyValue } from '@shared/domain/constants/transaction-type-keys';

import { TRANSACTION_TYPE_REPOSITORY } from '@transaction/domain/transaction-type-repository.token';
import type { ITransactionTypeRepository } from '@transaction/domain/ports/i-transaction-type-repository';

@Injectable()
export class UpdateRuleUseCase {
  public constructor(
    @Inject(RULE_REPOSITORY)
    private readonly ruleRepository: IRuleRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(RULE_TYPE_CATALOG_REPOSITORY)
    private readonly ruleTypeCatalogRepository: IRuleTypeCatalogRepository,
    @Inject(RULE_BASE_CATALOG_REPOSITORY)
    private readonly ruleBaseCatalogRepository: IRuleBaseCatalogRepository,
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: ITransactionTypeRepository,
  ) {}

  public async execute(
    params: UpdateRuleRequestDto,
  ): Promise<RuleResourceResponseDto> {
    const existing: Rule | undefined =
      await this.ruleRepository.findOwnedByUser({
        ruleId: params.ruleId,
        userId: params.userId,
      });
    if (existing === undefined) {
      throw new NotFoundException('Rule not found');
    }
    const ruleType = await this.ruleTypeCatalogRepository.findById({
      id: existing.ruleTypeId,
    });
    const ruleBase = await this.ruleBaseCatalogRepository.findById({
      id: existing.ruleBaseId,
    });
    if (ruleType === undefined || ruleBase === undefined) {
      throw new BadRequestException('Rule metadata is inconsistent');
    }
    const name: string =
      params.body.name !== undefined ? params.body.name.trim() : existing.name;
    const isActive: boolean =
      params.body.isActive !== undefined
        ? params.body.isActive
        : existing.isActive;
    const pattern: string =
      params.body.pattern !== undefined
        ? params.body.pattern.trim()
        : existing.pattern;
    const sourceAccountId: string | undefined =
      params.body.sourceAccountId !== undefined
        ? params.body.sourceAccountId
        : existing.sourceAccountId;
    const sourceCategoryId: string | undefined =
      params.body.sourceCategoryId !== undefined
        ? params.body.sourceCategoryId
        : existing.sourceCategoryId;
    const effectCategoryIds: string[] =
      params.body.effectCategoryIds !== undefined
        ? [...new Set(params.body.effectCategoryIds)]
        : ruleType.key === RuleTypeKey.categorization
          ? [...existing.effectCategoryIds]
          : [];
    const excludesFromStats: boolean =
      ruleType.key === RuleTypeKey.exclusion
        ? params.body.excludesFromStats !== undefined
          ? params.body.excludesFromStats
          : existing.excludesFromStats
        : false;
    const sourceTransactionTypeId: string | undefined =
      await this.resolveSourceTransactionTypeId(
        ruleBase.key,
        params.body.matchedTransactionTypeKey,
        existing,
      );
    const isPairAllowed: boolean =
      await this.ruleBaseCatalogRepository.isPairAllowed({
        ruleTypeKey: ruleType.key,
        ruleBaseKey: ruleBase.key,
      });
    assertRuleTypeBaseShape({
      ruleTypeKey: ruleType.key,
      ruleBaseKey: ruleBase.key,
      isPairAllowed,
      pattern,
      sourceAccountId,
      sourceCategoryId,
      sourceTransactionTypeId,
      effectCategoryIds,
      excludesFromStats,
    });
    await this.validateResourceOwnership({
      userId: params.userId,
      effectCategoryIds,
      sourceAccountId,
      sourceCategoryId,
    });
    const updated: Rule = new Rule(
      existing.id,
      name,
      isActive,
      existing.ruleTypeId,
      existing.ruleBaseId,
      pattern,
      sourceAccountId,
      sourceCategoryId,
      sourceTransactionTypeId,
      effectCategoryIds,
      excludesFromStats,
      existing.userId,
    );
    const saved: Rule = await this.ruleRepository.update({
      id: updated.id,
      name: updated.name,
      isActive: updated.isActive,
      ruleTypeId: updated.ruleTypeId,
      ruleBaseId: updated.ruleBaseId,
      pattern: updated.pattern,
      sourceAccountId: updated.sourceAccountId,
      sourceCategoryId: updated.sourceCategoryId,
      sourceTransactionTypeId: updated.sourceTransactionTypeId,
      effectCategoryIds: updated.effectCategoryIds,
      excludesFromStats: updated.excludesFromStats,
      userId: updated.userId,
    });
    return Object.assign(
      new RuleResourceResponseDto(),
      RuleToResourceMapper.responseProps(saved, ruleType.key, ruleBase.key),
    );
  }

  private async resolveSourceTransactionTypeId(
    ruleBaseKey: string,
    transactionTypeKey: TransactionTypeKeyValue | undefined,
    existing: Rule,
  ): Promise<string | undefined> {
    if (ruleBaseKey !== RuleBaseKey.transaction_type) {
      if (transactionTypeKey !== undefined) {
        throw new BadRequestException(
          'matchedTransactionTypeKey is only for transaction_type base',
        );
      }
      return existing.sourceTransactionTypeId;
    }
    if (transactionTypeKey === undefined) {
      return existing.sourceTransactionTypeId;
    }
    const resolved = await this.transactionTypeRepository.findByKey({
      key: transactionTypeKey,
    });
    if (resolved === undefined) {
      throw new BadRequestException('Unknown transaction type');
    }
    return resolved.id;
  }

  private async validateResourceOwnership(params: {
    readonly userId: string;
    readonly effectCategoryIds: readonly string[];
    readonly sourceAccountId: string | undefined;
    readonly sourceCategoryId: string | undefined;
  }): Promise<void> {
    for (const categoryId of params.effectCategoryIds) {
      const c = await this.categoryRepository.findAccessibleByUser({
        categoryId,
        userId: params.userId,
      });
      if (c === undefined) {
        throw new BadRequestException('Category not found or not accessible');
      }
    }
    if (params.sourceCategoryId !== undefined) {
      const c = await this.categoryRepository.findAccessibleByUser({
        categoryId: params.sourceCategoryId,
        userId: params.userId,
      });
      if (c === undefined) {
        throw new BadRequestException('Category not found or not accessible');
      }
    }
    if (params.sourceAccountId !== undefined) {
      const a = await this.accountRepository.findOwnedByUser({
        accountId: params.sourceAccountId,
        userId: params.userId,
      });
      if (a === undefined) {
        throw new BadRequestException('Account not found for current user');
      }
    }
  }
}
