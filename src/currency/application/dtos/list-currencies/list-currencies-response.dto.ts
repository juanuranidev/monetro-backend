import { ApiProperty } from '@nestjs/swagger';

/** One row in {@link ListCurrenciesUseCase} result. */
export class ListCurrenciesResultDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty({ example: 'USD' })
  public code!: string;

  @ApiProperty({ example: '$' })
  public symbol!: string;

  @ApiProperty()
  public name!: string;
}
