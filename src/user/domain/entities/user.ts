/**
 * User aggregate root (domain). `password` holds the bcrypt hash at rest when loaded from persistence.
 */
export class User {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string | undefined,
    public readonly image: string | undefined,
  ) {}
}
