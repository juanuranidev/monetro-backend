import { Category } from '@category/domain/entities/category';
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
  public static fromCategoryFieldsToPostgresRowPartial(input: {
    readonly id: string;
    readonly name: string;
    readonly icon: string | undefined;
    readonly isDefault: boolean;
    readonly userId: string | undefined;
  }): Partial<CategoryTypeOrmEntity> {
    return {
      id: input.id,
      name: input.name,
      icon: input.icon ?? null,
      isDefault: input.isDefault,
      userId: input.userId ?? null,
    };
  }
}
