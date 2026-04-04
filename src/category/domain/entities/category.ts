export class Category {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly icon: string | undefined,
    public readonly isDefault: boolean,
    public readonly userId: string | undefined,
  ) {}
}
