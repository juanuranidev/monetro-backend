import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  public email!: string;

  @ApiProperty({ minLength: 8, example: 'password12' })
  @IsString()
  @MinLength(8)
  public password!: string;
}
