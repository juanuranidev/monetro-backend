import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class SignupRequestDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @MinLength(1)
  public name!: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  public email!: string;

  @ApiProperty({ minLength: 8, example: 'password12' })
  @IsString()
  @MinLength(8)
  public password!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public authId?: string;

  @ApiPropertyOptional({ maxLength: 2048 })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  public image?: string;
}
