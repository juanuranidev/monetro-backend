import { IsUUID } from 'class-validator';

/**
 * Input for {@link GetAccountsUseCase} (caller supplies the authenticated user id).
 */
export class GetAccountsRequestDto {
  @IsUUID()
  public userId!: string;
}
