import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  Length,
  IsString,
  IsBoolean,
  MinLength,
  IsOptional,
} from 'class-validator';

/**
 * Partial fields for {@link UpdateAccountUseCase} (HTTP body on PATCH /accounts/:id).
 */
export class UpdateAccountBodyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  public name?: string;

  @ApiPropertyOptional({ description: 'Display identifier, e.g. Visa *1234' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  public identifier?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public excludeFromStats?: boolean;

  @ApiPropertyOptional({ example: 'USD', minLength: 3, maxLength: 3 })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  public currencyCode?: string;
}
