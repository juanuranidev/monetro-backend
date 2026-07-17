import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';

import type { Category } from '@category/domain/entities/category';
import { CategoryMapper } from '@category/infrastructure/postgres/mappers/category.mapper';
import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';
import type { CategoryCreateData } from '@category/domain/ports/types/category-create-data';
import type { CategoryUpdateData } from '@category/domain/ports/types/category-update-data';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';
import type { CategoryListByUserIdData } from '@category/domain/ports/types/category-list-by-user-id-data';
import type { CategorySoftDeleteForUserData } from '@category/domain/ports/types/category-soft-delete-for-user-data';
import type { CategoryFindAccessibleByUserData } from '@category/domain/ports/types/category-find-accessible-by-user-data';

@Injectable()
export class CategoryTypeOrmRepository implements ICategoryRepository {
  public constructor(
    @InjectRepository(CategoryTypeOrmEntity)
    private readonly repository: Repository<CategoryTypeOrmEntity>,
  ) {}

  public async create(data: CategoryCreateData): Promise<Category> {
    const entity: CategoryTypeOrmEntity = this.repository.create(
      CategoryMapper.fromCategoryCreateData(data),
    );
    const saved: CategoryTypeOrmEntity = await this.repository.save(entity);
    return CategoryMapper.fromPostgresToDomain(saved);
  }

  public async update(data: CategoryUpdateData): Promise<Category> {
    const row: CategoryTypeOrmEntity | null = await this.repository
      .createQueryBuilder('c')
      .where('c.id = :id', { id: data.id })
      .andWhere('c.user_id = :userId', { userId: data.userId })
      .andWhere('c.is_active = :active', { active: true })
      .getOne();
    if (row === null) {
      throw new NotFoundException('Category not found');
    }
    row.name = data.name;
    row.icon = data.icon;
    const saved: CategoryTypeOrmEntity = await this.repository.save(row);
    return CategoryMapper.fromPostgresToDomain(saved);
  }

  public async softDeleteByIdForUser(
    data: CategorySoftDeleteForUserData,
  ): Promise<void> {
    const result = await this.repository
      .createQueryBuilder()
      .update(CategoryTypeOrmEntity)
      .set({ isActive: false })
      .where('id = :categoryId', { categoryId: data.categoryId })
      .andWhere('user_id = :userId', { userId: data.userId })
      .andWhere('is_active = :active', { active: true })
      .execute();
    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('Category not found');
    }
  }

  public async findAccessibleByUser(
    data: CategoryFindAccessibleByUserData,
  ): Promise<Category | undefined> {
    const row: CategoryTypeOrmEntity | null = await this.repository
      .createQueryBuilder('c')
      .where('c.id = :categoryId', { categoryId: data.categoryId })
      .andWhere('c.user_id = :userId', { userId: data.userId })
      .andWhere('c.is_active = :active', { active: true })
      .getOne();
    return row === null ? undefined : CategoryMapper.fromPostgresToDomain(row);
  }

  public async listAccessibleByUser(
    data: CategoryListByUserIdData,
  ): Promise<readonly Category[]> {
    const rows: CategoryTypeOrmEntity[] = await this.repository
      .createQueryBuilder('c')
      .where('c.user_id = :userId', { userId: data.userId })
      .andWhere('c.is_active = :active', { active: true })
      .orderBy('c.name', 'ASC')
      .getMany();
    return rows.map((row) => CategoryMapper.fromPostgresToDomain(row));
  }
}
