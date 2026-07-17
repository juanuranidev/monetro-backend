import { ApiProperty } from '@nestjs/swagger';

export class CreditCardCatalogItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public key!: string;

  @ApiProperty()
  public displayNameEs!: string;
}
