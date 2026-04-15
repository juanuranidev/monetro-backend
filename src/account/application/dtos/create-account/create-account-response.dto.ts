import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccountResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public identifier!: string;

  @ApiPropertyOptional()
  public icon?: string;

  @ApiProperty()
  public excludeFromStats!: boolean;

  @ApiProperty({ format: 'uuid' })
  public currencyId!: string;
}
