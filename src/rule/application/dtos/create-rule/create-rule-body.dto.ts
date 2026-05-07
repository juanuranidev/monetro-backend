import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsIn,
  IsUUID,
  IsArray,
  Matches,
  IsString,
  IsBoolean,
  MinLength,
  IsOptional,
  ArrayMaxSize,
} from 'class-validator';

import { TransactionTypeKey } from '@shared/domain/constants/transaction-type-keys';

const SLUG: RegExp = /^[a-z][a-z0-9_]*$/;

/** HTTP body for POST /rules (user id comes from JWT, not the payload). */
export class CreateRuleBodyDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public name!: string;

  @ApiProperty({ example: 'categorization' })
  @IsString()
  @Matches(SLUG, { message: 'ruleTypeKey must be a lowercase slug' })
  public ruleTypeKey!: string;

  @ApiProperty({ example: 'keyword' })
  @IsString()
  @Matches(SLUG, { message: 'ruleBaseKey must be a lowercase slug' })
  public ruleBaseKey!: string;

  @ApiPropertyOptional({
    description: 'Text match for keyword base',
    default: '',
  })
  @IsOptional()
  @IsString()
  public pattern?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'For account base: the account the rule matches on',
  })
  @IsOptional()
  @IsUUID()
  public sourceAccountId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'For category base: the category the rule matches on',
  })
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
    description:
      'Categorization: 1–5 category ids (unique; duplicates removed server-side)',
    maxItems: 5,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsUUID('4', { each: true })
  public effectCategoryIds?: string[];

  @ApiPropertyOptional({
    description:
      'Exclusion: whether matching transactions are excluded from stats (default true)',
  })
  @IsOptional()
  @IsBoolean()
  public excludesFromStats?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;
}
