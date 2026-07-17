import type { UpdateCreditCardBodyDto } from '@credit-card/application/dtos/update-credit-card/update-credit-card-body.dto';

/** PATCH body plus route scope for updating a credit card. */
export class UpdateCreditCardRequestDto {
  public userId!: string;

  public accountId!: string;

  public creditCardId!: string;

  public body!: UpdateCreditCardBodyDto;
}
