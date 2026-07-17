import type { MoneyAmount } from '@shared/domain/value-objects/money-amount';

export class CreditCard {
  public constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly brandId: string,
    public readonly tierId: string,
    public readonly lastSixDigits: string,
    public readonly expiryMonth: number,
    public readonly expiryYear: number,
    public readonly creditLimit: MoneyAmount | undefined,
  ) {}
}
