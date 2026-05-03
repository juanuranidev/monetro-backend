import { ApiProperty } from '@nestjs/swagger';

export class RuleBaseCatalogItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty({ description: 'Stable slug, e.g. keyword' })
  public key!: string;

  @ApiProperty()
  public createdAt!: string;

  @ApiProperty()
  public updatedAt!: string;
}
