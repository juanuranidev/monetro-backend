import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryResponseDto {
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
}
