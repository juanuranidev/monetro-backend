import { Type } from 'class-transformer';

import { IsUUID, ValidateNested } from 'class-validator';

import { UpdateAccountBodyDto } from '@account/application/dtos/update-account/update-account-body.dto';

/**
 * Input for {@link UpdateAccountUseCase} (path ids plus HTTP body).
 */
export class UpdateAccountRequestDto {
  @IsUUID()
  public accountId!: string;

  @IsUUID()
  public userId!: string;

  @ValidateNested()
  @Type(() => UpdateAccountBodyDto)
  public body!: UpdateAccountBodyDto;
}
