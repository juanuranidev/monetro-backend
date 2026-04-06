import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserEntityDto {
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

  public constructor(
    id: string,
    name: string,
    email: string,
    authId: string | undefined,
    image: string | undefined,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    if (authId !== undefined) {
      this.authId = authId;
    }
    if (image !== undefined) {
      this.image = image;
    }
  }
}
