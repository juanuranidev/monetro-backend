import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ maxLength: 320 })
  @IsEmail()
  @MaxLength(320)
  public email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(512)
  public password!: string;
}
