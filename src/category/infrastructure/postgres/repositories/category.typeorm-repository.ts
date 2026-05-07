import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';

import { CategoryMapper } from '@category/infrastructure/postgres/mappers/category.mapper';
import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';
import {
  type Category,
  type CategoryCreateData,
} from '@category/domain/entities/category';

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

  public async update(domain: Category): Promise<Category> {
    const row: CategoryTypeOrmEntity | null = await this.repository
      .createQueryBuilder('c')
      .where('c.id = :id', { id: domain.id })
      .andWhere('c.user_id = :userId', { userId: domain.userId })
      .andWhere('c.is_active = :active', { active: true })
      .getOne();
    if (row === null) {
      throw new NotFoundException('Category not found');
    }
    row.name = domain.name;
    row.icon = domain.icon;
    const saved: CategoryTypeOrmEntity = await this.repository.save(row);
    return CategoryMapper.fromPostgresToDomain(saved);
  }

  public async softDeleteByIdForUser(
    categoryId: string,
    userId: string,
  ): Promise<void> {
    const result = await this.repository
      .createQueryBuilder()
      .update(CategoryTypeOrmEntity)
      .set({ isActive: false })
      .where('id = :categoryId', { categoryId })
      .andWhere('user_id = :userId', { userId })
      .andWhere('is_active = :active', { active: true })
      .execute();
    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('Category not found');
    }
  }

  public async findAccessibleByUser(
    categoryId: string,
    userId: string,
  ): Promise<Category | undefined> {
    const row: CategoryTypeOrmEntity | null = await this.repository
      .createQueryBuilder('c')
      .where('c.id = :categoryId', { categoryId })
      .andWhere('c.user_id = :userId', { userId })
      .andWhere('c.is_active = :active', { active: true })
      .getOne();
    return row === null ? undefined : CategoryMapper.fromPostgresToDomain(row);
  }

  public async listAccessibleByUser(
    userId: string,
  ): Promise<readonly Category[]> {
    const rows: CategoryTypeOrmEntity[] = await this.repository
      .createQueryBuilder('c')
      .where('c.user_id = :userId', { userId })
      .andWhere('c.is_active = :active', { active: true })
      .orderBy('c.name', 'ASC')
      .getMany();
    return rows.map((row) => CategoryMapper.fromPostgresToDomain(row));
  }
}
