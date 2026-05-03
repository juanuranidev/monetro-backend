import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

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

  @ApiPropertyOptional({ enum: ['INCOME', 'EXPENSE'] })
  @IsOptional()
  @IsString()
  @IsIn(['INCOME', 'EXPENSE'])
  public matchedTransactionTypeCode?: 'INCOME' | 'EXPENSE';

  @ApiPropertyOptional({ type: [String], format: 'uuid' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  public effectCategoryIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public excludesFromStats?: boolean;
}
