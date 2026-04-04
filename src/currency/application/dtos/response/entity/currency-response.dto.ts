import { ApiProperty } from '@nestjs/swagger';

export class CurrencyResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty({ example: 'USD' })
  public code!: string;

  @ApiProperty({ example: '$' })
  public symbol!: string;

  @ApiProperty()
  public name!: string;

  public constructor(id: string, code: string, symbol: string, name: string) {
    this.id = id;
    this.code = code;
    this.symbol = symbol;
    this.name = name;
  }
}
