import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsIn,
  IsUUID,
  Length,
  Matches,
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
  IsArray,
  ArrayMinSize,
  ValidateIf,
} from 'class-validator';

export class UpdateTransactionBodyDto {
  @ApiPropertyOptional({
    description:
      'Amount as a decimal string (max 8 integer digits, 2 fractional).',
    example: '99.50',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{1,8}(\.\d{1,2})?$/, {
    message:
      'amount must be a positive decimal with up to 8 integer digits and 2 decimals',
  })
  public amount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  public description?: string;

  @ApiPropertyOptional({ example: '2026-04-03' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  public recordDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public excludeFromStats?: boolean;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'When set, replaces all categories; at least one id required.',
  })
  @ValidateIf((o: UpdateTransactionBodyDto) => o.categoryIds !== undefined)
  @IsArray()
  @ArrayMinSize(1, { message: 'When provided, categoryIds must be non-empty' })
  @IsUUID('4', { each: true })
  public categoryIds?: string[];

  @ApiPropertyOptional({ enum: ['INCOME', 'EXPENSE'] })
  @IsOptional()
  @IsString()
  @IsIn(['INCOME', 'EXPENSE'])
  public transactionTypeCode?: 'INCOME' | 'EXPENSE';

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  public accountId?: string;

  @ApiPropertyOptional({ example: 'USD', minLength: 3, maxLength: 3 })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  public currencyCode?: string;
}
