import type { CreateTransactionBodyDto } from '@transaction/application/dtos/create-transaction/create-transaction-body.dto';

/**
 * Input for {@link CreateTransactionUseCase}. Built in the controller from {@link CreateTransactionBodyDto} and the authenticated user's id.
 */
export class CreateTransactionRequestDto {
  public userId!: string;

  public amount!: string;

  public description?: string;

  public recordDate!: string;

  public excludeFromStats?: boolean;

  public categoryIds!: string[];

  public transactionTypeKey!: 'income' | 'expense';

  public currencyKey!: string;

  public accountId?: string;

  public creditCardId?: string;

  /**
   * Maps validated HTTP body plus JWT-derived `userId` into use-case input.
   */
  public static fromBody(
    body: CreateTransactionBodyDto,
    userId: string,
  ): CreateTransactionRequestDto {
    const dto: CreateTransactionRequestDto = new CreateTransactionRequestDto();
    dto.userId = userId;
    dto.amount = body.amount;
    dto.description = body.description;
    dto.recordDate = body.recordDate;
    dto.excludeFromStats = body.excludeFromStats;
    dto.categoryIds = body.categoryIds ?? [];
    dto.transactionTypeKey = body.transactionTypeKey;
    dto.currencyKey = body.currencyKey;
    dto.accountId = body.accountId;
    dto.creditCardId = body.creditCardId;
    return dto;
  }
}
