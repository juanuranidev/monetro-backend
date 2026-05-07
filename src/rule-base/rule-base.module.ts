import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RuleTypeModule } from '@rule-type/rule-type.module';

import { RuleBaseController } from '@rule-base/infrastructure/controllers/rule-base.controller';

import { ReadAllRuleBasesUseCase } from '@rule-base/application/use-cases/read-all-rule-bases/read-all-rule-bases.use-case';

import { RULE_BASE_CATALOG_REPOSITORY } from '@rule-base/domain/rule-base-catalog-repository.token';

import { RuleBaseCatalogTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-base-catalog.typeorm-entity';

import { RuleTypeCatalogTypeOrmEntity } from '@rule-type/infrastructure/postgres/entities/rule-type-catalog.typeorm-entity';

import { RuleTypeBasePivotTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-type-base-pivot.typeorm-entity';

import { RuleBaseCatalogTypeOrmRepository } from '@rule-base/infrastructure/postgres/repositories/rule-base-catalog.typeorm-repository';

@Module({
  imports: [
    RuleTypeModule,
    TypeOrmModule.forFeature([
      RuleBaseCatalogTypeOrmEntity,
      RuleTypeBasePivotTypeOrmEntity,
      RuleTypeCatalogTypeOrmEntity,
    ]),
  ],
  controllers: [RuleBaseController],
  providers: [
    {
      provide: RULE_BASE_CATALOG_REPOSITORY,
      useClass: RuleBaseCatalogTypeOrmRepository,
    },
    ReadAllRuleBasesUseCase,
  ],
  exports: [RULE_BASE_CATALOG_REPOSITORY],
})
export class RuleBaseModule {}
