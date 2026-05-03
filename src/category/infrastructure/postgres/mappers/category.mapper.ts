import {
  Category,
  type CategoryCreateData,
} from '@category/domain/entities/category';
import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';

export class CategoryMapper {
  /**
   * Maps a Postgres-backed category row (TypeORM entity) to the domain model.
   */
  public static fromPostgresToDomain(entity: CategoryTypeOrmEntity): Category {
    return new Category(
      entity.id,
      entity.name,
      entity.icon ?? undefined,
      entity.isDefault,
      entity.userId ?? undefined,
    );
  }

  /**
   * Maps explicit category fields (e.g. on create) to a partial Postgres row for TypeORM.
   */
  public static fromCategoryCreateData(
    data: CategoryCreateData,
  ): Partial<CategoryTypeOrmEntity> {
    return {
      name: data.name,
      icon: data.icon ?? null,
      isDefault: data.isDefault,
      userId: data.userId ?? null,
    };
  }
}
