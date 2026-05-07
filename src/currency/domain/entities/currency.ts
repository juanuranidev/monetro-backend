export class Currency {
  public constructor(
    public readonly id: string,
    public readonly key: string,
    public readonly symbol: string,
    public readonly name: string,
  ) {}
}
