import type { CreateAccountBodyDto } from '@account/application/dtos/create-account/create-account-body.dto';

/**
 * Input for {@link CreateAccountUseCase}. Built in the controller from {@link CreateAccountBodyDto} and the authenticated user's id.
 */
export class CreateAccountRequestDto {
  public userId!: string;

  public name!: string;

  public identifier!: string;

  public icon?: string;

  public excludeFromStats?: boolean;

  public currencyKey!: string;

  /**
   * Maps validated HTTP body plus JWT-derived `userId` into use-case input.
   */
  public static fromBody(
    body: CreateAccountBodyDto,
    userId: string,
  ): CreateAccountRequestDto {
    const dto: CreateAccountRequestDto = new CreateAccountRequestDto();
    dto.userId = userId;
    dto.name = body.name;
    dto.identifier = body.identifier;
    dto.icon = body.icon;
    dto.excludeFromStats = body.excludeFromStats;
    dto.currencyKey = body.currencyKey;
    return dto;
  }
}
