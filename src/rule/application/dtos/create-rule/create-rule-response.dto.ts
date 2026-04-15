import { ApiProperty } from '@nestjs/swagger';

export class CreateRuleResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public pattern!: string;

  @ApiProperty({ format: 'uuid' })
  public targetCategoryId!: string;

  @ApiProperty({ format: 'uuid' })
  public targetAccountId!: string;
}
