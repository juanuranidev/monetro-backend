import { ApiProperty } from '@nestjs/swagger';

export class TransactionEntityDto {
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

  public constructor(
    id: string,
    amount: string,
    description: string,
    recordDate: string,
    excludeFromStats: boolean,
    categoryId: string,
    transactionTypeId: string,
    currencyId: string,
    accountId: string,
  ) {
    this.id = id;
    this.amount = amount;
    this.description = description;
    this.recordDate = recordDate;
    this.excludeFromStats = excludeFromStats;
    this.categoryId = categoryId;
    this.transactionTypeId = transactionTypeId;
    this.currencyId = currencyId;
    this.accountId = accountId;
  }
}
