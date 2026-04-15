import {
  ApiProperty,
  ApiHideProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsUUID,
  IsString,
  IsBoolean,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateCategoryRequestDto {
  @ApiHideProperty()
  @IsUUID()
  public userId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  public name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public icon?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  public isDefault?: boolean;
}
