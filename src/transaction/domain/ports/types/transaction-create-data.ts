import type { MoneyAmount } from '@shared/domain/value-objects/money-amount';

export interface TransactionCreateData {
  readonly amount: MoneyAmount;

  readonly description: string;

  readonly recordDate: Date;

  readonly excludeFromStats: boolean;

  readonly categoryIds: readonly string[];

  readonly transactionTypeId: string;

  readonly currencyId: string;

  readonly accountId: string | undefined;

  readonly creditCardId: string | undefined;
}
