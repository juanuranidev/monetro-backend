import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../domain/entities/category';
import type { ICategoryRepository } from '../../../domain/ports/i-category-repository';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryTypeOrmEntity } from '../entities/category.typeorm-entity';

@Injectable()
export class CategoryTypeOrmRepository implements ICategoryRepository {
  public constructor(
    @InjectRepository(CategoryTypeOrmEntity)
    private readonly repository: Repository<CategoryTypeOrmEntity>,
  ) {}

  public async create(domain: Category): Promise<Category> {
    const entity: CategoryTypeOrmEntity = this.repository.create(
      CategoryMapper.toNewRow({
        id: domain.id,
        name: domain.name,
        icon: domain.icon,
        isDefault: domain.isDefault,
        userId: domain.userId,
      }) as CategoryTypeOrmEntity,
    );
    const saved: CategoryTypeOrmEntity = await this.repository.save(entity);
    return CategoryMapper.toDomain(saved);
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
    return row === null ? undefined : CategoryMapper.toDomain(row);
  }
}
