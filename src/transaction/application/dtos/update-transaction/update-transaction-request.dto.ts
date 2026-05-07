import { Type } from 'class-transformer';

import { IsUUID, ValidateNested } from 'class-validator';

import { UpdateTransactionBodyDto } from '@transaction/application/dtos/update-transaction/update-transaction-body.dto';

/**
 * Input for {@link UpdateTransactionUseCase} (path ids plus HTTP body).
 */
export class UpdateTransactionRequestDto {
  @IsUUID()
  public transactionId!: string;

  @IsUUID()
  public userId!: string;

  @ValidateNested()
  @Type(() => UpdateTransactionBodyDto)
  public body!: UpdateTransactionBodyDto;
}
