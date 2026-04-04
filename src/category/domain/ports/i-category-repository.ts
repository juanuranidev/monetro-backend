import type { Category } from '../entities/category';

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  findAccessibleByUser(
    categoryId: string,
    userId: string,
  ): Promise<Category | undefined>;
}
