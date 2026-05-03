import { Rule } from '@rule/domain/entities/rule';
import { CreateRuleResponseDto } from '@rule/application/dtos/create-rule/create-rule-response.dto';
import { RuleResourceResponseDto } from '@rule/application/dtos/rule-resource/rule-resource-response.dto';
import { RuleTypeKey } from '@rule/application/validation/rule-builtin-keys';

/**
 * Maps domain {@link Rule} + catalog keys to API DTOs.
 */
export class RuleToResourceMapper {
  public static toCreateResponse(
    rule: Rule,
    ruleTypeKey: string,
    ruleBaseKey: string,
  ): CreateRuleResponseDto {
    return RuleToResourceMapper.fill(
      new CreateRuleResponseDto(),
      rule,
      ruleTypeKey,
      ruleBaseKey,
    ) as CreateRuleResponseDto;
  }

  public static toResource(
    rule: Rule,
    ruleTypeKey: string,
    ruleBaseKey: string,
  ): RuleResourceResponseDto {
    return RuleToResourceMapper.fill(
      new RuleResourceResponseDto(),
      rule,
      ruleTypeKey,
      ruleBaseKey,
    ) as RuleResourceResponseDto;
  }

  private static fill(
    dto: RuleResourceResponseDto,
    rule: Rule,
    ruleTypeKey: string,
    ruleBaseKey: string,
  ): RuleResourceResponseDto {
    dto.id = rule.id;
    dto.name = rule.name;
    dto.isActive = rule.isActive;
    dto.ruleTypeKey = ruleTypeKey;
    dto.ruleBaseKey = ruleBaseKey;
    dto.pattern = rule.pattern;
    if (rule.sourceAccountId !== undefined) {
      dto.sourceAccountId = rule.sourceAccountId;
    }
    if (rule.sourceCategoryId !== undefined) {
      dto.sourceCategoryId = rule.sourceCategoryId;
    }
    if (rule.sourceTransactionTypeId !== undefined) {
      dto.sourceTransactionTypeId = rule.sourceTransactionTypeId;
    }
    if (ruleTypeKey === RuleTypeKey.categorization) {
      dto.effectCategoryIds = [...rule.effectCategoryIds];
    }
    if (ruleTypeKey === RuleTypeKey.exclusion) {
      dto.excludesFromStats = rule.excludesFromStats;
    }
    return dto;
  }
}
