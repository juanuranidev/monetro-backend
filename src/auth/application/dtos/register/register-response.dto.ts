import { ApiProperty } from '@nestjs/swagger';

/**
 * Successful registration payload: JWT plus non-sensitive user fields.
 */
export class RegisterResponseDto {
  @ApiProperty({
    description: 'Send in the Authorization header: Bearer {accessToken}',
  })
  public accessToken!: string;

  @ApiProperty({ enum: ['Bearer'] })
  public tokenType = 'Bearer' as const;

  @ApiProperty({ description: 'Time until the token expires, in seconds' })
  public expiresIn!: number;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      email: { type: 'string' },
    },
    required: ['id', 'name', 'email'],
  })
  public user!: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
  };
}
