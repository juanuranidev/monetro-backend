export interface AccountCreateData {
  readonly name: string;

  readonly identifier: string;

  readonly icon: string | undefined;

  readonly excludeFromStats: boolean;

  readonly currencyId: string;

  readonly userId: string;
}
