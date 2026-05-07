import type { RegisterBodyDto } from '@auth/application/dtos/register/register-body.dto';

/**
 * Input for {@link RegisterUseCase}. Built from {@link RegisterBodyDto} after HTTP validation.
 */
export class RegisterRequestDto {
  public name!: string;

  public email!: string;

  public password!: string;

  public static fromBody(body: RegisterBodyDto): RegisterRequestDto {
    const dto: RegisterRequestDto = new RegisterRequestDto();
    dto.name = body.name;
    dto.email = body.email;
    dto.password = body.password;
    return dto;
  }
}
