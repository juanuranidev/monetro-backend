import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Category } from '../../../domain/entities/category';
import { CATEGORY_REPOSITORY } from '../../../domain/category-repository.token';
import type { ICategoryRepository } from '../../../domain/ports/i-category-repository';
import { CategoryResponseDto } from '../../dtos/response/entity/category-response.dto';
import type { CreateCategoryRequestDto } from '../../dtos/request/create-category-request.dto';

@Injectable()
export class CreateCategoryUseCase {
  public constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async execute(
    userId: string,
    input: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const isDefault: boolean = input.isDefault ?? false;
    const category: Category = new Category(
      randomUUID(),
      input.name.trim(),
      input.icon?.trim(),
      isDefault,
      userId,
    );
    const saved: Category = await this.categoryRepository.create(category);
    return new CategoryResponseDto(
      saved.id,
      saved.name,
      saved.icon,
      saved.isDefault,
      saved.userId,
    );
  }
}
