import {
  ApiProperty,
  ApiHideProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsUUID,
  Length,
  IsString,
  IsBoolean,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateAccountRequestDto {
  @ApiHideProperty()
  @IsUUID()
  public userId!: string;

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

  @ApiProperty({ example: 'USD', minLength: 3, maxLength: 3 })
  @IsString()
  @Length(3, 3)
  public currencyCode!: string;
}
