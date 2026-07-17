/** Row from the `credit_card_brands` catalog. */
export class CreditCardBrand {
  public constructor(
    public readonly id: string,
    public readonly key: string,
    public readonly displayNameEs: string,
  ) {}
}
