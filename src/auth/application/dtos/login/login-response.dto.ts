import { ApiProperty } from '@nestjs/swagger';

/**
 * Successful login payload: JWT plus non-sensitive user fields.
 */
export class LoginResponseDto {
  @ApiProperty({
    description: 'Send in the Authorization header: Bearer {accessToken}',
  })
  public accessToken!: string;

  @ApiProperty({ enum: ['Bearer'] })
  public tokenType = 'Bearer' as const;

  @ApiProperty({ description: 'Time until the token expires, in seconds' })
  public expiresIn!: number;
}
