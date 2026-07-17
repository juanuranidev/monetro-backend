import type { CreateCreditCardBodyDto } from '@credit-card/application/dtos/create-credit-card/create-credit-card-body.dto';

/** Input for create credit card: URL account id plus body catalog keys and PAN trailer. */
export class CreateCreditCardRequestDto {
  public userId!: string;

  public accountId!: string;

  public brandKey!: string;

  public tierKey!: string;

  public lastSixDigits!: string;

  public expiryMonth!: number;

  public expiryYear!: number;

  public creditLimit?: string;

  public static fromRouteAndBody(
    accountId: string,
    body: CreateCreditCardBodyDto,
    userId: string,
  ): CreateCreditCardRequestDto {
    const dto: CreateCreditCardRequestDto = new CreateCreditCardRequestDto();
    dto.userId = userId;
    dto.accountId = accountId;
    dto.brandKey = body.brandKey;
    dto.tierKey = body.tierKey;
    dto.lastSixDigits = body.lastSixDigits.trim();
    dto.expiryMonth = body.expiryMonth;
    dto.expiryYear = body.expiryYear;
    dto.creditLimit = body.creditLimit;
    return dto;
  }
}
