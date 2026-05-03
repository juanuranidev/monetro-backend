import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ minLength: 1, maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  public name!: string;

  @ApiProperty({ maxLength: 320 })
  @IsEmail()
  @MaxLength(320)
  public email!: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 72,
    description:
      '8–72 characters; must include uppercase, lowercase, and a digit. Stored as bcrypt hash.',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/,
    {
      message:
        'Password must be 8–72 characters and include uppercase, lowercase, and a digit',
    },
  )
  public password!: string;
}
