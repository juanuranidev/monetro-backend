import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';
import {
  Category,
  type CategoryCreateData,
} from '@category/domain/entities/category';

import type { UserTypeOrmEntity } from '@user/infrastructure/postgres/entities/user.typeorm-entity';

export class CategoryMapper {
  /**
   * Maps a Postgres-backed category row (TypeORM entity) to the domain model.
   */
  public static fromPostgresToDomain(entity: CategoryTypeOrmEntity): Category {
    return new Category(
      entity.id,
      entity.name,
      entity.icon,
      entity.userId,
      entity.isActive,
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
      icon: data.icon,
      user: { id: data.userId } as UserTypeOrmEntity,
    };
  }
}
