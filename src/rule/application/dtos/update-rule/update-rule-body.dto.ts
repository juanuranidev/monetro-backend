import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsIn,
  IsUUID,
  IsArray,
  IsString,
  IsBoolean,
  MinLength,
  IsOptional,
  ArrayMaxSize,
} from 'class-validator';

import { TransactionTypeKey } from '@shared/domain/constants/transaction-type-keys';

export class UpdateRuleBodyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  public name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public pattern?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  public sourceAccountId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  public sourceCategoryId?: string;

  @ApiPropertyOptional({ enum: TransactionTypeKey })
  @IsOptional()
  @IsString()
  @IsIn([TransactionTypeKey.income, TransactionTypeKey.expense])
  public matchedTransactionTypeKey?: 'income' | 'expense';

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'At most 5 category ids for categorization rules',
    maxItems: 5,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsUUID('4', { each: true })
  public effectCategoryIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public excludesFromStats?: boolean;
}
