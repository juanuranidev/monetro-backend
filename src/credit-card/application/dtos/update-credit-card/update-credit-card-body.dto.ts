import { ApiPropertyOptional } from '@nestjs/swagger';

import { Max, Min, IsInt, Length, Matches, IsString, IsOptional } from 'class-validator';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

export class UpdateCreditCardBodyDto {
  @ApiPropertyOptional({ description: 'Catalog brand key (lowercase).' })
  @IsOptional()
  @IsString()
  @Length(2, TextFieldLimits.creditCardCatalogKey)
  public brandKey?: string;

  @ApiPropertyOptional({ description: 'Catalog tier/type key (lowercase).' })
  @IsOptional()
  @IsString()
  @Length(2, TextFieldLimits.creditCardCatalogKey)
  public tierKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: 'lastSixDigits must be exactly 6 digits' })
  public lastSixDigits?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  public expiryMonth?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(9999)
  public expiryYear?: number;

  @ApiPropertyOptional({
    description: 'Replacement limit (decimal string). Omit for no change.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^-?\d{1,8}(\.\d+)?$/)
  public creditLimit?: string;

  @ApiPropertyOptional({
    description:
      'When true, removes stored credit limit. Ignored if creditLimit is also sent.',
  })
  @IsOptional()
  public clearCreditLimit?: boolean;
}
