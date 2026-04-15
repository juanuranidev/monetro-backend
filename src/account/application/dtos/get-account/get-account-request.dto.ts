import { IsUUID } from 'class-validator';

/**
 * Input for {@link GetAccountUseCase} (caller supplies account id and authenticated user id).
 */
export class GetAccountRequestDto {
  @IsUUID()
  public accountId!: string;

  @IsUUID()
  public userId!: string;
}
