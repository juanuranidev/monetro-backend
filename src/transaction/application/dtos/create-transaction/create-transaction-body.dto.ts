import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
} from 'class-validator';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';
import { TransactionTypeKey } from '@shared/domain/constants/transaction-type-keys';

/** HTTP body for POST /transactions (user id comes from JWT, not the payload). */
export class CreateTransactionBodyDto {
  @ApiProperty({
    description:
      'Decimal string; optional leading minus; fractional digits beyond 2 are truncated toward zero.',
    example: '99.50',
  })
  @IsString()
  @Matches(/^-?\d{1,8}(\.\d+)?$/, {
    message:
      'amount must be a decimal with up to 8 integer digits (optional minus)',
  })
  public amount!: string;

  @ApiPropertyOptional({
    description: 'May be empty.',
    default: '',
    maxLength: TextFieldLimits.transactionDescription,
  })
  @IsOptional()
  @IsString()
  @MaxLength(TextFieldLimits.transactionDescription)
  public description?: string;

  @ApiProperty({
    description:
      'ISO 8601 instant with offset/Z, or naive local datetime interpreted in APP_TIMEZONE, or date-only yyyy-mm-dd.',
    example: '2026-04-03T15:30:00Z',
  })
  @IsString()
  @MaxLength(40)
  public recordDate!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  public excludeFromStats?: boolean;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Category IDs; duplicates are ignored. Omit or use [] when none.',
    default: [],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  public categoryIds?: string[];

  @ApiProperty({ enum: TransactionTypeKey })
  @IsString()
  @IsIn([TransactionTypeKey.income, TransactionTypeKey.expense])
  public transactionTypeKey!: 'income' | 'expense';

  @ApiProperty({ example: 'usd', minLength: 3, maxLength: 3 })
  @IsString()
  @Length(3, 3)
  public currencyKey!: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Posting leg: direct account movement. Provide exactly one of accountId or creditCardId.',
  })
  @IsOptional()
  @IsUUID('4')
  public accountId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Posting leg: movement on a credit card belonging to some account (see credit-card routes). Exactly one of accountId or creditCardId.',
  })
  @IsOptional()
  @IsUUID('4')
  public creditCardId?: string;
}
