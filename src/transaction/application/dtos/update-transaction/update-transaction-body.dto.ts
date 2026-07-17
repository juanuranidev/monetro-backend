import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsIn,
  IsUUID,
  Length,
  IsArray,
  Matches,
  IsString,
  IsBoolean,
  MaxLength,
  IsOptional,
  ValidateIf,
} from 'class-validator';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';
import { TransactionTypeKey } from '@shared/domain/constants/transaction-type-keys';

export class UpdateTransactionBodyDto {
  @ApiPropertyOptional({
    description:
      'Decimal string; optional leading minus; extra fractional digits truncated.',
    example: '99.50',
  })
  @IsOptional()
  @IsString()
  @Matches(/^-?\d{1,8}(\.\d+)?$/, {
    message:
      'amount must be a decimal with up to 8 integer digits (optional minus)',
  })
  public amount?: string;

  @ApiPropertyOptional({ maxLength: TextFieldLimits.transactionDescription })
  @IsOptional()
  @IsString()
  @MaxLength(TextFieldLimits.transactionDescription)
  public description?: string;

  @ApiPropertyOptional({
    description:
      'ISO 8601 with Z/offset, naive local (APP_TIMEZONE), or yyyy-mm-dd.',
    example: '2026-04-03T15:30:00Z',
  })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  public recordDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public excludeFromStats?: boolean;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description:
      'When set, replaces all categories; duplicates are ignored. Empty array clears categories.',
  })
  @ValidateIf((o: UpdateTransactionBodyDto) => o.categoryIds !== undefined)
  @IsArray()
  @IsUUID('4', { each: true })
  public categoryIds?: string[];

  @ApiPropertyOptional({ enum: TransactionTypeKey })
  @IsOptional()
  @IsString()
  @IsIn([TransactionTypeKey.income, TransactionTypeKey.expense])
  public transactionTypeKey?: 'income' | 'expense';

  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'When set to change posting leg, omit creditCardId on the same patch. Sets direct account leg.',
  })
  @IsOptional()
  @IsUUID('4')
  public accountId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'When set to change posting leg, omit accountId on the same patch. Sets credit card leg.',
  })
  @IsOptional()
  @IsUUID('4')
  public creditCardId?: string;

  @ApiPropertyOptional({ example: 'usd', minLength: 3, maxLength: 3 })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  public currencyKey?: string;
}
