import { ApiProperty } from '@nestjs/swagger';

/** Response for {@link RunCatalogSeedUseCase} / POST /database/seed. */
export class RunCatalogSeedResponseDto {
  @ApiProperty({ example: true })
  public ok!: boolean;
}
