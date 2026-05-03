import { Inject, Injectable } from '@nestjs/common';

import type { Category } from '@category/domain/entities/category';
import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import { GetCategoriesResponseDto } from '@category/application/dtos/get-categories/get-categories-response.dto';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';
import type { GetCategoriesRequestDto } from '@category/application/dtos/get-categories/get-categories-request.dto';

/**
 * Returns system default categories and categories owned by the authenticated user.
 */
@Injectable()
export class GetCategoriesUseCase {
  public constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async execute(
    input: GetCategoriesRequestDto,
  ): Promise<GetCategoriesResponseDto[]> {
    const categories: readonly Category[] =
      await this.categoryRepository.listAccessibleByUser(input.userId);
    return categories.map((category: Category) => {
      const row: GetCategoriesResponseDto = new GetCategoriesResponseDto();
      row.id = category.id;
      row.name = category.name;
      row.isDefault = category.isDefault;
      if (category.icon !== undefined) {
        row.icon = category.icon;
      }
      if (category.userId !== undefined) {
        row.userId = category.userId;
      }
      return row;
    });
  }
}
