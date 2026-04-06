import { ApiProperty } from '@nestjs/swagger';
import { UserEntityDto } from '../entity/user-entity.dto';

export class AuthResponseDto {
  @ApiProperty()
  public accessToken!: string;

  @ApiProperty({ type: UserEntityDto })
  public user!: UserEntityDto;
}
