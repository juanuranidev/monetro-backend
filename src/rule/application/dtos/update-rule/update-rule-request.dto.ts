import { Type } from 'class-transformer';

import { IsUUID, ValidateNested } from 'class-validator';

import { UpdateRuleBodyDto } from '@rule/application/dtos/update-rule/update-rule-body.dto';

/**
 * Input for {@link UpdateRuleUseCase} (path ids plus HTTP body).
 */
export class UpdateRuleRequestDto {
  @IsUUID()
  public ruleId!: string;

  @IsUUID()
  public userId!: string;

  @ValidateNested()
  @Type(() => UpdateRuleBodyDto)
  public body!: UpdateRuleBodyDto;
}
