import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Response payload after creating or updating a credit card. */
export class CreateCreditCardResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty({ format: 'uuid' })
  public accountId!: string;

  @ApiProperty({ format: 'uuid' })
  public brandId!: string;

  @ApiProperty({ format: 'uuid' })
  public tierId!: string;

  @ApiProperty({ example: '123456' })
  public lastSixDigits!: string;

  @ApiProperty()
  public expiryMonth!: number;

  @ApiProperty()
  public expiryYear!: number;

  @ApiPropertyOptional({ description: 'Fixed-scale decimal string when set' })
  public creditLimit?: string;
}
