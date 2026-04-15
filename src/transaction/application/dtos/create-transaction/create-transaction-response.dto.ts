import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty({ description: 'Fixed-scale decimal string' })
  public amount!: string;

  @ApiProperty()
  public description!: string;

  @ApiProperty({ example: '2026-04-03' })
  public recordDate!: string;

  @ApiProperty()
  public excludeFromStats!: boolean;

  @ApiProperty({ format: 'uuid' })
  public categoryId!: string;

  @ApiProperty({ format: 'uuid' })
  public transactionTypeId!: string;

  @ApiProperty({ format: 'uuid' })
  public currencyId!: string;

  @ApiProperty({ format: 'uuid' })
  public accountId!: string;
}
