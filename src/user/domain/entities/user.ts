/**
 * User aggregate root (domain). Password hash is omitted after persistence mapping when not needed.
 */
export class User {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string | undefined,
    public readonly authId: string | undefined,
    public readonly image: string | undefined,
  ) {}
}
