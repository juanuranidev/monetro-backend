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

import { RULE_REPOSITORY } from '@rule/domain/rule-repository.token';
import { type RuleCreateData } from '@rule/domain/ports/types/rule-create-data';
import type { IRuleRepository } from '@rule/domain/ports/i-rule-repository';
import { RuleToResourceMapper } from '@rule/application/mappers/rule-to-resource.mapper';
import { CreateRuleResponseDto } from '@rule/application/dtos/create-rule/create-rule-response.dto';
import { assertRuleTypeBaseShape } from '@rule/application/validation/rule-input-validator';
import type { CreateRuleRequestDto } from '@rule/application/dtos/create-rule/create-rule-request.dto';
import {
  RuleBaseKey,
  RuleTypeKey,
} from '@rule/application/validation/rule-builtin-keys';

import type { TransactionTypeKeyValue } from '@shared/domain/constants/transaction-type-keys';

import { TRANSACTION_TYPE_REPOSITORY } from '@transaction/domain/transaction-type-repository.token';
import type { ITransactionTypeRepository } from '@transaction/domain/ports/i-transaction-type-repository';

@Injectable()
export class CreateRuleUseCase {
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
    input: CreateRuleRequestDto,
  ): Promise<CreateRuleResponseDto> {
    const userId: string = input.userId;
    const ruleType = await this.ruleTypeCatalogRepository.findByKey({
      key: input.ruleTypeKey,
    });
    if (ruleType === undefined) {
      throw new NotFoundException('Unknown rule type');
    }
    const ruleBase = await this.ruleBaseCatalogRepository.findByKey({
      key: input.ruleBaseKey,
    });
    if (ruleBase === undefined) {
      throw new NotFoundException('Unknown rule base');
    }
    const isPairAllowed: boolean =
      await this.ruleBaseCatalogRepository.isPairAllowed({
        ruleTypeKey: ruleType.key,
        ruleBaseKey: ruleBase.key,
      });
    const pattern: string = (input.pattern ?? '').trim();
    const effectCategoryIds: string[] =
      ruleType.key === RuleTypeKey.categorization
        ? [...new Set(input.effectCategoryIds ?? [])]
        : [];
    const excludesFromStats: boolean =
      ruleType.key === RuleTypeKey.exclusion
        ? (input.excludesFromStats ?? true)
        : false;
    const sourceTransactionTypeId: string | undefined =
      await this.resolveSourceTransactionTypeId(
        ruleBase.key,
        input.matchedTransactionTypeKey,
      );
    assertRuleTypeBaseShape({
      ruleTypeKey: ruleType.key,
      ruleBaseKey: ruleBase.key,
      isPairAllowed,
      pattern,
      sourceAccountId: input.sourceAccountId,
      sourceCategoryId: input.sourceCategoryId,
      sourceTransactionTypeId,
      effectCategoryIds,
      excludesFromStats,
    });
    await this.validateResourceOwnership({
      userId,
      effectCategoryIds,
      sourceAccountId: input.sourceAccountId,
      sourceCategoryId: input.sourceCategoryId,
    });
    const isActive: boolean = input.isActive ?? true;
    const data: RuleCreateData = {
      name: input.name.trim(),
      isActive,
      ruleTypeId: ruleType.id,
      ruleBaseId: ruleBase.id,
      pattern,
      sourceAccountId: input.sourceAccountId,
      sourceCategoryId: input.sourceCategoryId,
      sourceTransactionTypeId,
      effectCategoryIds,
      excludesFromStats,
      userId,
    };
    const saved = await this.ruleRepository.create(data);
    return Object.assign(
      new CreateRuleResponseDto(),
      RuleToResourceMapper.responseProps(saved, ruleType.key, ruleBase.key),
    );
  }

  private async resolveSourceTransactionTypeId(
    ruleBaseKey: string,
    transactionTypeKey: TransactionTypeKeyValue | undefined,
  ): Promise<string | undefined> {
    if (ruleBaseKey !== RuleBaseKey.transaction_type) {
      if (transactionTypeKey !== undefined) {
        throw new BadRequestException(
          'matchedTransactionTypeKey is only for transaction_type base',
        );
      }
      return undefined;
    }
    if (transactionTypeKey === undefined) {
      return undefined;
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
