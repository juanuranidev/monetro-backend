import type { CreateCategoryBodyDto } from '@category/application/dtos/create-category/create-category-body.dto';

/**
 * Input for {@link CreateCategoryUseCase}. Built in the controller from {@link CreateCategoryBodyDto} and the authenticated user's id.
 */
export class CreateCategoryRequestDto {
  public userId!: string;
  public name!: string;
  public icon!: string;

  /**
   * Maps validated HTTP body plus JWT-derived `userId` into use-case input.
   */
  public static fromBody(
    body: CreateCategoryBodyDto,
    userId: string,
  ): CreateCategoryRequestDto {
    const dto: CreateCategoryRequestDto = new CreateCategoryRequestDto();
    dto.userId = userId;
    dto.name = body.name;
    dto.icon = body.icon;
    return dto;
  }
}
