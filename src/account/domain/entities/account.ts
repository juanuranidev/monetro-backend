export class Account {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly identifier: string,
    public readonly icon: string | undefined,
    public readonly excludeFromStats: boolean,
    public readonly currencyId: string,
    public readonly userId: string,
  ) {}
}
