import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserSummaryDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public email!: string;

  @ApiPropertyOptional()
  public image?: string;
}
