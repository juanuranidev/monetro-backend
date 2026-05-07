import type {
  Category,
  CategoryCreateData,
} from '@category/domain/entities/category';

export interface ICategoryRepository {
  create(data: CategoryCreateData): Promise<Category>;
  update(category: Category): Promise<Category>;
  softDeleteByIdForUser(categoryId: string, userId: string): Promise<void>;
  findAccessibleByUser(
    categoryId: string,
    userId: string,
  ): Promise<Category | undefined>;
  listAccessibleByUser(userId: string): Promise<readonly Category[]>;
}
