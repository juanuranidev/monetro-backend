import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryRequestDto {
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
