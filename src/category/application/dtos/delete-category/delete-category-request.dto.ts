import { IsUUID } from 'class-validator';

/**
 * Input for {@link DeleteCategoryUseCase}.
 */
export class DeleteCategoryRequestDto {
  @IsUUID()
  public categoryId!: string;

  @IsUUID()
  public userId!: string;
}
