import { IsUUID } from 'class-validator';

/**
 * Input for {@link GetRulesUseCase} (caller supplies the authenticated user id).
 */
export class GetRulesRequestDto {
  @IsUUID()
  public userId!: string;
}
