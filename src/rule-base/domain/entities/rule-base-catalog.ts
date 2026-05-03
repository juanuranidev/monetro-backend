export class RuleBaseCatalog {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly key: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
