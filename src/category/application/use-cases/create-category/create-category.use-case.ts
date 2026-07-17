import { Inject, Injectable } from '@nestjs/common';

import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import { type CategoryCreateData } from '@category/domain/ports/types/category-create-data';
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
    const data: CategoryCreateData = {
      name: input.name.trim(),
      icon: input.icon,
      userId: input.userId,
    };
    const saved = await this.categoryRepository.create(data);
    return Object.assign(new CreateCategoryResponseDto(), {
      id: saved.id,
      name: saved.name,
      userId: saved.userId,
      icon: saved.icon,
    });
  }
}
