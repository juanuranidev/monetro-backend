import { Inject, Injectable } from '@nestjs/common';

import { type CategoryCreateData } from '@category/domain/entities/category';
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
    const data: CategoryCreateData = {
      name: input.name.trim(),
      icon: input.icon?.trim(),
      isDefault,
      userId: input.userId,
    };
    const saved = await this.categoryRepository.create(data);
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
