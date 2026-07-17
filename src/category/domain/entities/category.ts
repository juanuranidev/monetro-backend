export class Category {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly icon: string,
    public readonly userId: string,
    public readonly isActive: boolean,
  ) {}
}
