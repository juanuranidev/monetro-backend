import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import { Matches, IsString, IsOptional } from 'class-validator';

const RULE_KEY_PATTERN: RegExp = /^[a-z][a-z0-9_]*$/;

export class ReadAllRuleBasesQueryDto {
  @ApiPropertyOptional({
    description:
      'When set, only rule bases allowed for this rule type (slug) are returned',
    example: 'categorization',
  })
  @Transform(({ value }: { value: unknown }) =>
    value === '' || value === null ? undefined : value,
  )
  @IsOptional()
  @IsString()
  @Matches(RULE_KEY_PATTERN, {
    message: 'ruleTypeKey must be a lowercase slug',
  })
  public ruleTypeKey?: string;
}
