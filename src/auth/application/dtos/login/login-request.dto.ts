import type { LoginBodyDto } from '@auth/application/dtos/login/login-body.dto';

/**
 * Input for {@link LoginUseCase}. Built from {@link LoginBodyDto} after HTTP validation.
 */
export class LoginRequestDto {
  public email!: string;

  public password!: string;

  public static fromBody(body: LoginBodyDto): LoginRequestDto {
    const dto: LoginRequestDto = new LoginRequestDto();
    dto.email = body.email;
    dto.password = body.password;
    return dto;
  }
}
