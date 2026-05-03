import { ApiProperty } from '@nestjs/swagger';

export class TransactionTypeItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty({ example: 'INCOME' })
  public code!: string;
}
