import type { CreateRuleBodyDto } from '@rule/application/dtos/create-rule/create-rule-body.dto';

import type { TransactionTypeKeyValue } from '@shared/domain/constants/transaction-type-keys';

/**
 * Input for {@link CreateRuleUseCase}. Built in the controller from {@link CreateRuleBodyDto} and the authenticated user's id.
 */
export class CreateRuleRequestDto {
  public userId!: string;

  public name!: string;

  public ruleTypeKey!: string;

  public ruleBaseKey!: string;

  public pattern?: string;

  public sourceAccountId?: string;

  public sourceCategoryId?: string;

  public matchedTransactionTypeKey?: TransactionTypeKeyValue;

  public effectCategoryIds?: string[];

  public excludesFromStats?: boolean;

  public isActive?: boolean;

  /**
   * Maps validated HTTP body plus JWT-derived `userId` into use-case input.
   */
  public static fromBody(
    body: CreateRuleBodyDto,
    userId: string,
  ): CreateRuleRequestDto {
    const dto: CreateRuleRequestDto = new CreateRuleRequestDto();
    dto.userId = userId;
    dto.name = body.name;
    dto.ruleTypeKey = body.ruleTypeKey;
    dto.ruleBaseKey = body.ruleBaseKey;
    dto.pattern = body.pattern;
    dto.sourceAccountId = body.sourceAccountId;
    dto.sourceCategoryId = body.sourceCategoryId;
    dto.matchedTransactionTypeKey = body.matchedTransactionTypeKey;
    dto.effectCategoryIds = body.effectCategoryIds;
    dto.excludesFromStats = body.excludesFromStats;
    dto.isActive = body.isActive;
    return dto;
  }
}
