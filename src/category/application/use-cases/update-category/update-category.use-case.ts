import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { Category } from '@category/domain/entities/category';
import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';
import { UpdateCategoryResponseDto } from '@category/application/dtos/update-category/update-category-response.dto';
import type { UpdateCategoryBodyDto } from '@category/application/dtos/update-category/update-category-body.dto';
import type { UpdateCategoryRequestDto } from '@category/application/dtos/update-category/update-category-request.dto';

/**
 * Updates a category owned by the user. At least one field in the body must be provided.
 */
@Injectable()
export class UpdateCategoryUseCase {
  public constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async execute(
    input: UpdateCategoryRequestDto,
  ): Promise<UpdateCategoryResponseDto> {
    const patch: UpdateCategoryBodyDto = input.body;
    if (!this.hasPatchFields(patch)) {
      throw new BadRequestException('No fields to update');
    }
    const existing: Category | undefined =
      await this.categoryRepository.findAccessibleByUser(
        input.categoryId,
        input.userId,
      );
    if (existing === undefined) {
      throw new NotFoundException('Category not found');
    }
    this.assertCategoryOwnedByUser(existing, input.userId);
    const name: string = patch.name !== undefined ? patch.name : existing.name;
    let icon: string = existing.icon;
    if (patch.icon !== undefined) {
      if (patch.icon.length === 0) {
        throw new BadRequestException(
          'icon cannot be empty; omit the field to keep the current icon',
        );
      }
      icon = patch.icon;
    }
    const updated: Category = new Category(
      existing.id,
      name,
      icon,
      existing.userId,
      existing.isActive,
    );
    const saved: Category = await this.categoryRepository.update(updated);
    return Object.assign(new UpdateCategoryResponseDto(), {
      id: saved.id,
      name: saved.name,
      userId: saved.userId,
      icon: saved.icon,
    });
  }

  private hasPatchFields(patch: UpdateCategoryBodyDto): boolean {
    return patch.name !== undefined || patch.icon !== undefined;
  }

  private assertCategoryOwnedByUser(category: Category, userId: string): void {
    if (category.userId !== userId) {
      throw new ForbiddenException(
        'Category does not belong to the current user',
      );
    }
  }
}
