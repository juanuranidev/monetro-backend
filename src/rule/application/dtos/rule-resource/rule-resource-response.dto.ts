import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RuleResourceResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public isActive!: boolean;

  @ApiProperty({ description: 'Rule intention slug' })
  public ruleTypeKey!: string;

  @ApiProperty({ description: 'Evaluation base slug' })
  public ruleBaseKey!: string;

  @ApiProperty({ description: 'Set for keyword base' })
  public pattern!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  public sourceAccountId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  public sourceCategoryId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  public sourceTransactionTypeId?: string;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'For categorization: categories applied when the rule matches',
  })
  public effectCategoryIds?: string[];

  @ApiPropertyOptional({
    description:
      'For exclusion: when true, matching transactions are excluded from stats',
  })
  public excludesFromStats?: boolean;
}
