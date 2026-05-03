import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** One row in {@link GetCategoriesUseCase} result. */
export class GetCategoriesResponseDto {
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
