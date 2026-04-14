import { ApiProperty } from '@nestjs/swagger';

import { IsUUID, IsString, MinLength } from 'class-validator';

export class CreateRuleRequestDto {
  @ApiProperty({ description: 'Pattern to match transaction descriptions' })
  @IsString()
  @MinLength(1)
  public pattern!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  public targetCategoryId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  public targetAccountId!: string;
}
