/**
 * Input for {@link GetTransactionsUseCase}. Built in the controller from
 * {@link GetTransactionsQueryDto} (validated) and {@link RequestUser.userId}.
 */
export class GetTransactionsRequestDto {
  public userId!: string;

  public accountId?: string;

  public creditCardId?: string;
}
