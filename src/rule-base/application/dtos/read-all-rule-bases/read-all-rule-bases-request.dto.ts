import type { ReadAllRuleBasesQueryDto } from '@rule-base/application/dtos/read-all-rule-bases/read-all-rule-bases-query.dto';

/**
 * Input for {@link ReadAllRuleBasesUseCase}. Built from {@link ReadAllRuleBasesQueryDto} after query validation.
 */
export class ReadAllRuleBasesRequestDto {
  public ruleTypeKey?: string;

  public static fromQuery(
    query: ReadAllRuleBasesQueryDto,
  ): ReadAllRuleBasesRequestDto {
    const dto: ReadAllRuleBasesRequestDto = new ReadAllRuleBasesRequestDto();
    dto.ruleTypeKey = query.ruleTypeKey;
    return dto;
  }
}
