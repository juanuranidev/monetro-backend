export class Rule {
  public constructor(
    public readonly id: string,
    public readonly pattern: string,
    public readonly targetCategoryId: string,
    public readonly targetAccountId: string,
    public readonly userId: string,
  ) {}
}
