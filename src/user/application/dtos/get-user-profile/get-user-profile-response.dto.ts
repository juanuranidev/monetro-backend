import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserProfileResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public email!: string;

  @ApiPropertyOptional()
  public authId?: string;

  @ApiPropertyOptional()
  public image?: string;
}
