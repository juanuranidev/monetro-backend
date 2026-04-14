import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Category } from '@category/domain/entities/category';
import { CategoryMapper } from '@category/infrastructure/postgres/mappers/category.mapper';
import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';

@Injectable()
export class CategoryTypeOrmRepository implements ICategoryRepository {
  public constructor(
    @InjectRepository(CategoryTypeOrmEntity)
    private readonly repository: Repository<CategoryTypeOrmEntity>,
  ) {}

  public async create(domain: Category): Promise<Category> {
    const entity: CategoryTypeOrmEntity = this.repository.create(
      CategoryMapper.fromCategoryFieldsToPostgresRowPartial({
        id: domain.id,
        name: domain.name,
        icon: domain.icon,
        isDefault: domain.isDefault,
        userId: domain.userId,
      }),
    );
    const saved: CategoryTypeOrmEntity = await this.repository.save(entity);
    return CategoryMapper.fromPostgresToDomain(saved);
  }

  public async findAccessibleByUser(
    categoryId: string,
    userId: string,
  ): Promise<Category | undefined> {
    const row: CategoryTypeOrmEntity | null = await this.repository
      .createQueryBuilder('c')
      .where('c.id = :categoryId', { categoryId })
      .andWhere('(c.user_id IS NULL OR c.user_id = :userId)', { userId })
      .getOne();
    return row === null ? undefined : CategoryMapper.fromPostgresToDomain(row);
  }
}
