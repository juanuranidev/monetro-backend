import {
  ApiProperty,
  ApiHideProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';

const SLUG: RegExp = /^[a-z][a-z0-9_]*$/;

export class CreateRuleRequestDto {
  @ApiHideProperty()
  @IsUUID()
  public userId!: string;

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

  @ApiPropertyOptional({ enum: ['INCOME', 'EXPENSE'] })
  @IsOptional()
  @IsString()
  @IsIn(['INCOME', 'EXPENSE'])
  public matchedTransactionTypeCode?: 'INCOME' | 'EXPENSE';

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Categorization: at least one id (validated in use case)',
  })
  @IsOptional()
  @IsArray()
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
