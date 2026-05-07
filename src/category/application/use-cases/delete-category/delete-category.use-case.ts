import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import type { Category } from '@category/domain/entities/category';
import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import { DeleteCategoryRequestDto } from '@category/application/dtos/delete-category/delete-category-request.dto';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';
import { DeleteCategoryResponseDto } from '@category/application/dtos/delete-category/delete-category-response.dto';

/**
 * Soft-deletes a category owned by the user (`is_active = false`).
 */
@Injectable()
export class DeleteCategoryUseCase {
  public constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async execute(
    input: DeleteCategoryRequestDto,
  ): Promise<DeleteCategoryResponseDto> {
    const existing: Category | undefined =
      await this.categoryRepository.findAccessibleByUser(
        input.categoryId,
        input.userId,
      );
    if (existing === undefined) {
      throw new NotFoundException('Category not found');
    }
    this.assertCategoryOwnedByUser(existing, input.userId);
    await this.categoryRepository.softDeleteByIdForUser(
      input.categoryId,
      input.userId,
    );
    return new DeleteCategoryResponseDto();
  }

  private assertCategoryOwnedByUser(category: Category, userId: string): void {
    if (category.userId !== userId) {
      throw new ForbiddenException(
        'Category does not belong to the current user',
      );
    }
  }
}
