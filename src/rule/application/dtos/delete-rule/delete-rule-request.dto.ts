import { IsUUID } from 'class-validator';

/**
 * Input for {@link DeleteRuleUseCase}.
 */
export class DeleteRuleRequestDto {
  @IsUUID()
  public ruleId!: string;

  @IsUUID()
  public userId!: string;
}
