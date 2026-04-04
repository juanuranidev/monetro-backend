import { ApiProperty } from '@nestjs/swagger';
import { AuthUserSummaryDto } from './entity/auth-user-summary.dto';

export class AuthResponseDto {
  @ApiProperty()
  public accessToken!: string;

  @ApiProperty({ type: AuthUserSummaryDto })
  public user!: AuthUserSummaryDto;
}
