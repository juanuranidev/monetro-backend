import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserEntityDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public email!: string;

  @ApiPropertyOptional()
  public image?: string;
}
