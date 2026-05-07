import { ApiProperty } from '@nestjs/swagger';

export class TransactionTypeItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty({ example: 'income' })
  public key!: string;

  @ApiProperty({ example: 'Ingreso' })
  public displayNameEs!: string;
}
