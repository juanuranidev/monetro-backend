/** Input for listing credit cards under one account for the authenticated user. */
export class ListCreditCardsRequestDto {
  public userId!: string;

  public accountId!: string;
}
