import { Category } from '../../../domain/entities/category';
import { CategoryTypeOrmEntity } from '../entities/category.typeorm-entity';

export class CategoryMapper {
  public static toDomain(entity: CategoryTypeOrmEntity): Category {
    return new Category(
      entity.id,
      entity.name,
      entity.icon ?? undefined,
      entity.isDefault,
      entity.userId ?? undefined,
    );
  }

  public static toNewRow(input: {
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
