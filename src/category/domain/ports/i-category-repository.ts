import type {
  Category,
  CategoryCreateData,
} from '@category/domain/entities/category';

export interface ICategoryRepository {
  create(data: CategoryCreateData): Promise<Category>;
  findAccessibleByUser(
    categoryId: string,
    userId: string,
  ): Promise<Category | undefined>;
  listAccessibleByUser(userId: string): Promise<readonly Category[]>;
}
