import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RULE_TYPE_CATALOG_REPOSITORY } from '@rule-type/domain/rule-type-catalog-repository.token';
import { ReadAllRuleTypesUseCase } from '@rule-type/application/use-cases/read-all-rule-types/read-all-rule-types.use-case';
import { RuleTypeController } from '@rule-type/infrastructure/controllers/rule-type.controller';
import { RuleTypeCatalogTypeOrmEntity } from '@rule-type/infrastructure/postgres/entities/rule-type-catalog.typeorm-entity';
import { RuleTypeCatalogTypeOrmRepository } from '@rule-type/infrastructure/postgres/repositories/rule-type-catalog.typeorm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([RuleTypeCatalogTypeOrmEntity])],
  controllers: [RuleTypeController],
  providers: [
    {
      provide: RULE_TYPE_CATALOG_REPOSITORY,
      useClass: RuleTypeCatalogTypeOrmRepository,
    },
    ReadAllRuleTypesUseCase,
  ],
  exports: [RULE_TYPE_CATALOG_REPOSITORY, TypeOrmModule],
})
export class RuleTypeModule {}
