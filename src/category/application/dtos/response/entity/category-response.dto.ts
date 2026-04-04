import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiPropertyOptional()
  public icon?: string;

  @ApiProperty()
  public isDefault!: boolean;

  @ApiPropertyOptional({ format: 'uuid' })
  public userId?: string;

  public constructor(
    id: string,
    name: string,
    icon: string | undefined,
    isDefault: boolean,
    userId: string | undefined,
  ) {
    this.id = id;
    this.name = name;
    if (icon !== undefined) {
      this.icon = icon;
    }
    this.isDefault = isDefault;
    if (userId !== undefined) {
      this.userId = userId;
    }
  }
}
