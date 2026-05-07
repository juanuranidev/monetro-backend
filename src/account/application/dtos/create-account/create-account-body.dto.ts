import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  Length,
  IsString,
  IsBoolean,
  MinLength,
  IsOptional,
} from 'class-validator';

/** HTTP body for POST /accounts (user id comes from JWT, not the payload). */
export class CreateAccountBodyDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public name!: string;

  @ApiProperty({ description: 'Display identifier, e.g. Visa *1234' })
  @IsString()
  @MinLength(1)
  public identifier!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public icon?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  public excludeFromStats?: boolean;

  @ApiProperty({ example: 'usd', minLength: 3, maxLength: 3 })
  @IsString()
  @Length(3, 3)
  public currencyKey!: string;
}
