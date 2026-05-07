import { ApiProperty } from '@nestjs/swagger';

/** One row in {@link GetCategoriesUseCase} result. */
export class GetCategoriesResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty({
    description: 'Unicode emoji; always set for persisted categories.',
  })
  public icon!: string;
}
