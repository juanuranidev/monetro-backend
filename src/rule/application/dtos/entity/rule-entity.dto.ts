import { ApiProperty } from '@nestjs/swagger';

export class RuleEntityDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public pattern!: string;

  @ApiProperty({ format: 'uuid' })
  public targetCategoryId!: string;

  @ApiProperty({ format: 'uuid' })
  public targetAccountId!: string;

  public constructor(
    id: string,
    pattern: string,
    targetCategoryId: string,
    targetAccountId: string,
  ) {
    this.id = id;
    this.pattern = pattern;
    this.targetCategoryId = targetCategoryId;
    this.targetAccountId = targetAccountId;
  }
}
