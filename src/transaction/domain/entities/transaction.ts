import type { MoneyAmount } from '../../../shared/domain/value-objects/money-amount';

export class Transaction {
  public constructor(
    public readonly id: string,
    public readonly amount: MoneyAmount,
    public readonly description: string,
    public readonly recordDate: Date,
    public readonly excludeFromStats: boolean,
    public readonly categoryId: string,
    public readonly transactionTypeId: string,
    public readonly currencyId: string,
    public readonly accountId: string,
    public readonly userId: string,
  ) {}
}
