/** Scoped GET or DELETE credit card route (no PATCH body). */
export class ScopedCreditCardActionRequestDto {
  public userId!: string;

  public accountId!: string;

  public creditCardId!: string;
}
