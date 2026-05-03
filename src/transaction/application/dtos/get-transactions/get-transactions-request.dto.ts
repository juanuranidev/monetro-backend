import { IsUUID } from 'class-validator';

/**
 * Input for {@link GetTransactionsUseCase} (caller supplies the authenticated user id).
 */
export class GetTransactionsRequestDto {
  @IsUUID()
  public userId!: string;
}
