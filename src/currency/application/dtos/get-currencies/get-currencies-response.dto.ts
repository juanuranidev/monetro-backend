import { ApiProperty } from '@nestjs/swagger';

/** One row in {@link GetCurrenciesUseCase} result. */
export class GetCurrenciesResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty({ example: 'USD' })
  public code!: string;

  @ApiProperty({ example: '$' })
  public symbol!: string;

  @ApiProperty()
  public name!: string;
}
