import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AccountResponseDto {
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

  public constructor(
    id: string,
    name: string,
    identifier: string,
    icon: string | undefined,
    excludeFromStats: boolean,
    currencyId: string,
  ) {
    this.id = id;
    this.name = name;
    this.identifier = identifier;
    if (icon !== undefined) {
      this.icon = icon;
    }
    this.excludeFromStats = excludeFromStats;
    this.currencyId = currencyId;
  }
}
