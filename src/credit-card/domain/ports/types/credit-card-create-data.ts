import type { MoneyAmount } from '@shared/domain/value-objects/money-amount';

export interface CreditCardCreateData {
  readonly accountId: string;

  readonly brandId: string;

  readonly tierId: string;

  readonly lastSixDigits: string;

  readonly expiryMonth: number;

  readonly expiryYear: number;

  readonly creditLimit?: MoneyAmount;
}
