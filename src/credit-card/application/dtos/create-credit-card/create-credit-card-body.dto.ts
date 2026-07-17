import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  Max,
  Min,
  IsInt,
  Length,
  Matches,
  IsString,
  IsOptional,
} from 'class-validator';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

export class CreateCreditCardBodyDto {
  @ApiProperty({
    description: 'Catalog key (normalized to lowercase)',
    example: 'visa',
  })
  @IsString()
  @Length(2, TextFieldLimits.creditCardCatalogKey)
  public brandKey!: string;

  @ApiProperty({
    description: 'Catalog key for card tier/type (normalized to lowercase)',
    example: 'gold',
  })
  @IsString()
  @Length(2, TextFieldLimits.creditCardCatalogKey)
  public tierKey!: string;

  @ApiProperty({ example: '123456', description: 'Last six PAN digits.' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'lastSixDigits must be exactly 6 digits' })
  public lastSixDigits!: string;

  @ApiProperty({ description: '1–12', example: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  public expiryMonth!: number;

  @ApiProperty({
    description: 'Four-digit year',
    example: 2028,
  })
  @IsInt()
  @Min(1900)
  @Max(9999)
  public expiryYear!: number;

  @ApiPropertyOptional({
    description:
      'Optional credit limit decimal string (same format as transaction amount). Omit when unlimited/unknown.',
    example: '5000.00',
  })
  @IsOptional()
  @IsString()
  @Matches(/^-?\d{1,8}(\.\d+)?$/)
  public creditLimit?: string;
}
