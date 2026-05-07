import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty({
    description: 'Unicode emoji icon (same rules as on create).',
  })
  public icon!: string;

  @ApiProperty({ format: 'uuid' })
  public userId!: string;
}
