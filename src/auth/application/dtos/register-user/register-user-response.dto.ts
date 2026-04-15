import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserResponseUserDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public email!: string;

  @ApiPropertyOptional()
  public image?: string;
}

export class RegisterUserResponseDto {
  @ApiProperty()
  public accessToken!: string;

  @ApiProperty({ type: RegisterUserResponseUserDto })
  public user!: RegisterUserResponseUserDto;
}
