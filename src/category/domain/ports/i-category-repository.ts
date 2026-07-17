import type { Category } from '@category/domain/entities/category';
import type { CategoryCreateData } from '@category/domain/ports/types/category-create-data';
import type { CategoryUpdateData } from '@category/domain/ports/types/category-update-data';
import type { CategoryListByUserIdData } from '@category/domain/ports/types/category-list-by-user-id-data';
import type { CategorySoftDeleteForUserData } from '@category/domain/ports/types/category-soft-delete-for-user-data';
import type { CategoryFindAccessibleByUserData } from '@category/domain/ports/types/category-find-accessible-by-user-data';

export interface ICategoryRepository {
  create(data: CategoryCreateData): Promise<Category>;

  update(data: CategoryUpdateData): Promise<Category>;

  softDeleteByIdForUser(data: CategorySoftDeleteForUserData): Promise<void>;

  findAccessibleByUser(
    data: CategoryFindAccessibleByUserData,
  ): Promise<Category | undefined>;

  listAccessibleByUser(
    data: CategoryListByUserIdData,
  ): Promise<readonly Category[]>;
}
