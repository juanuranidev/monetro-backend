import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginUserResponseUserDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public email!: string;

  @ApiPropertyOptional()
  public image?: string;
}

export class LoginUserResponseDto {
  @ApiProperty()
  public accessToken!: string;

  @ApiProperty({ type: LoginUserResponseUserDto })
  public user!: LoginUserResponseUserDto;
}
