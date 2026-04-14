import { ApiProperty } from '@nestjs/swagger';

import { UserEntityDto } from '@auth/application/dtos/entity/user-entity.dto';

export class AuthResponseDto {
  @ApiProperty()
  public accessToken!: string;

  @ApiProperty({ type: UserEntityDto })
  public user!: UserEntityDto;
}
