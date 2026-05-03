import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RuleTypeCatalogItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty({ description: 'Stable slug, e.g. categorization' })
  public key!: string;

  @ApiPropertyOptional()
  public description?: string;

  @ApiProperty()
  public createdAt!: string;

  @ApiProperty()
  public updatedAt!: string;
}
