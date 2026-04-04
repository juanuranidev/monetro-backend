import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCategoryUseCase } from './application/use-cases/create-category/create-category.use-case';
import { CATEGORY_REPOSITORY } from './domain/category-repository.token';
import { CategoryController } from './infrastructure/controllers/category.controller';
import { CategoryTypeOrmEntity } from './infrastructure/postgres/entities/category.typeorm-entity';
import { CategoryTypeOrmRepository } from './infrastructure/postgres/repositories/category.typeorm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryTypeOrmEntity])],
  controllers: [CategoryController],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryTypeOrmRepository,
    },
    CreateCategoryUseCase,
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoryModule {}
