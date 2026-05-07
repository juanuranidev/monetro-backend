import { Type } from 'class-transformer';

import { IsUUID, ValidateNested } from 'class-validator';

import { UpdateCategoryBodyDto } from '@category/application/dtos/update-category/update-category-body.dto';

/**
 * Input for {@link UpdateCategoryUseCase} (path ids plus HTTP body).
 */
export class UpdateCategoryRequestDto {
  @IsUUID()
  public categoryId!: string;

  @IsUUID()
  public userId!: string;

  @ValidateNested()
  @Type(() => UpdateCategoryBodyDto)
  public body!: UpdateCategoryBodyDto;
}
