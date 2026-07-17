import { Rule } from '@rule/domain/entities/rule';
import { RuleTypeKey } from '@rule/application/validation/rule-builtin-keys';
import { RuleResourceResponseDto } from '@rule/application/dtos/rule-resource/rule-resource-response.dto';

/**
 * Maps domain {@link Rule} + catalog keys to API DTOs.
 */
export class RuleToResourceMapper {
  /**
   * Plain props for {@link Object.assign}(new Rule DTO instance, props).
   */
  public static responseProps(
    rule: Rule,
    ruleTypeKey: string,
    ruleBaseKey: string,
  ): Partial<RuleResourceResponseDto> {
    const props: Partial<RuleResourceResponseDto> = {
      id: rule.id,
      name: rule.name,
      isActive: rule.isActive,
      ruleTypeKey,
      ruleBaseKey,
      pattern: rule.pattern,
    };
    if (rule.sourceAccountId !== undefined) {
      props.sourceAccountId = rule.sourceAccountId;
    }
    if (rule.sourceCategoryId !== undefined) {
      props.sourceCategoryId = rule.sourceCategoryId;
    }
    if (rule.sourceTransactionTypeId !== undefined) {
      props.sourceTransactionTypeId = rule.sourceTransactionTypeId;
    }
    if (ruleTypeKey === RuleTypeKey.categorization) {
      props.effectCategoryIds = [...rule.effectCategoryIds];
    }
    if (ruleTypeKey === RuleTypeKey.exclusion) {
      props.excludesFromStats = rule.excludesFromStats;
    }
    return props;
  }
}
