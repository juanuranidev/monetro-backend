import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from '@category/infrastructure/controllers/category.controller';
import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import { GetCategoriesUseCase } from '@category/application/use-cases/get-categories/get-categories.use-case';
import { CreateCategoryUseCase } from '@category/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@category/application/use-cases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '@category/application/use-cases/delete-category/delete-category.use-case';
import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';
import { CategoryTypeOrmRepository } from '@category/infrastructure/postgres/repositories/category.typeorm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryTypeOrmEntity])],
  controllers: [CategoryController],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryTypeOrmRepository,
    },
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    GetCategoriesUseCase,
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoryModule {}
