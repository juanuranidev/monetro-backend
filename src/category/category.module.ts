import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCategoryUseCase } from '@category/application/use-cases/create-category/create-category.use-case';
import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import { CategoryController } from '@category/infrastructure/controllers/category.controller';
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
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoryModule {}
