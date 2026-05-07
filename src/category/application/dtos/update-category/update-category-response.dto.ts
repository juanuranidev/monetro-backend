import { ApiProperty } from '@nestjs/swagger';

/** Response body for {@link UpdateCategoryUseCase} / `PATCH /categories/:id`. */
export class UpdateCategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty({
    description: 'Unicode emoji; always set for persisted categories.',
  })
  public icon!: string;

  @ApiProperty({ format: 'uuid' })
  public userId!: string;
}
