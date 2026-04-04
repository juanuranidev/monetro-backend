export class Currency {
  public constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly symbol: string,
    public readonly name: string,
  ) {}
}
