/**
 * Input contract for creating a user aggregate before persistence assigns `id`.
 * Object shapes passed to repository ports live under `domain/ports/types/`.
 */
export interface UserCreateData {
  readonly name: string;

  readonly email: string;

  readonly password: string | undefined;

  readonly authId: string | undefined;

  readonly image: string | undefined;
}
