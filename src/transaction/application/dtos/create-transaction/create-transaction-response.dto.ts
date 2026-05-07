import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty({ description: 'Fixed-scale decimal string' })
  public amount!: string;

  @ApiProperty()
  public description!: string;

  @ApiProperty({
    description: 'UTC instant ISO 8601',
    example: '2026-04-03T15:30:00.000Z',
  })
  public recordDate!: string;

  @ApiProperty()
  public excludeFromStats!: boolean;

  @ApiProperty({ type: [String], format: 'uuid' })
  public categoryIds!: string[];

  @ApiProperty({ format: 'uuid' })
  public transactionTypeId!: string;

  @ApiProperty({ format: 'uuid' })
  public currencyId!: string;

  @ApiProperty({ format: 'uuid' })
  public accountId!: string;
}
