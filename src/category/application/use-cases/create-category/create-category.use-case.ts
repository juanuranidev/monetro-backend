import { randomUUID } from 'crypto';

import { Inject, Injectable } from '@nestjs/common';

import { Category } from '@category/domain/entities/category';
import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';
import { CreateCategoryResponseDto } from '@category/application/dtos/create-category/create-category-response.dto';
import type { CreateCategoryRequestDto } from '@category/application/dtos/create-category/create-category-request.dto';

@Injectable()
export class CreateCategoryUseCase {
  public constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async execute(
    input: CreateCategoryRequestDto,
  ): Promise<CreateCategoryResponseDto> {
    const isDefault: boolean = input.isDefault ?? false;
    const category: Category = new Category(
      randomUUID(),
      input.name.trim(),
      input.icon?.trim(),
      isDefault,
      input.userId,
    );
    const saved: Category = await this.categoryRepository.create(category);
    const response: CreateCategoryResponseDto = new CreateCategoryResponseDto();
    response.id = saved.id;
    response.name = saved.name;
    response.isDefault = saved.isDefault;
    if (saved.icon !== undefined) {
      response.icon = saved.icon;
    }
    if (saved.userId !== undefined) {
      response.userId = saved.userId;
    }
    return response;
  }
}
