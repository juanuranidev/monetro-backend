import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from '@account/account.module';

import { CategoryModule } from '@category/category.module';

import { RuleBaseModule } from '@rule-base/rule-base.module';

import { RuleTypeModule } from '@rule-type/rule-type.module';

import { TransactionModule } from '@transaction/transaction.module';

import { RuleController } from '@rule/infrastructure/controllers/rule.controller';
import { RULE_REPOSITORY } from '@rule/domain/rule-repository.token';
import { CreateRuleUseCase } from '@rule/application/use-cases/create-rule/create-rule.use-case';
import { GetRulesUseCase } from '@rule/application/use-cases/get-rules/get-rules.use-case';
import { UpdateRuleUseCase } from '@rule/application/use-cases/update-rule/update-rule.use-case';
import { DeleteRuleUseCase } from '@rule/application/use-cases/delete-rule/delete-rule.use-case';
import { RuleCategorizationTargetTypeOrmEntity } from '@rule/infrastructure/postgres/entities/rule-categorization-target.typeorm-entity';
import { RuleRecordTypeOrmEntity } from '@rule/infrastructure/postgres/entities/rule-record.typeorm-entity';
import { RuleRecordTypeOrmRepository } from '@rule/infrastructure/postgres/repositories/rule-record.typeorm-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RuleRecordTypeOrmEntity,
      RuleCategorizationTargetTypeOrmEntity,
    ]),
    RuleTypeModule,
    RuleBaseModule,
    CategoryModule,
    AccountModule,
    TransactionModule,
  ],
  controllers: [RuleController],
  providers: [
    {
      provide: RULE_REPOSITORY,
      useClass: RuleRecordTypeOrmRepository,
    },
    CreateRuleUseCase,
    GetRulesUseCase,
    UpdateRuleUseCase,
    DeleteRuleUseCase,
  ],
})
export class RuleModule {}
