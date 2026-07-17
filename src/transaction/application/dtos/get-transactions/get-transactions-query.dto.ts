import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsUUID, IsOptional } from 'class-validator';

/** Optional query for `GET /transactions`; at most one scope filter may be set. */
export class GetTransactionsQueryDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Restrict to transactions affecting this account (direct leg or any card under that account).',
  })
  @IsOptional()
  @IsUUID('4')
  public accountId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Restrict to transactions whose posting leg is this credit card id. Mutually exclusive with accountId.',
  })
  @IsOptional()
  @IsUUID('4')
  public creditCardId?: string;
}
