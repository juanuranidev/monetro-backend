import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsIn,
  IsUUID,
  Length,
  Matches,
  IsString,
  IsBoolean,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateTransactionRequestDto {
  @ApiProperty({
    description:
      'Amount as a decimal string (max 8 integer digits, 2 fractional). Parsed with exact decimal arithmetic.',
    example: '99.50',
  })
  @IsString()
  @Matches(/^\d{1,8}(\.\d{1,2})?$/, {
    message:
      'amount must be a positive decimal with up to 8 integer digits and 2 decimals',
  })
  public amount!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  public description!: string;

  @ApiProperty({
    description: 'Calendar date of the transaction (ISO 8601 date)',
    example: '2026-04-03',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  public recordDate!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  public excludeFromStats?: boolean;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  public categoryId!: string;

  @ApiProperty({ enum: ['INCOME', 'EXPENSE'] })
  @IsString()
  @IsIn(['INCOME', 'EXPENSE'])
  public transactionTypeCode!: 'INCOME' | 'EXPENSE';

  @ApiProperty({ example: 'USD', minLength: 3, maxLength: 3 })
  @IsString()
  @Length(3, 3)
  public currencyCode!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  public accountId!: string;
}
