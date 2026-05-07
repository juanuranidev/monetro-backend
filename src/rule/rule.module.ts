import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { RuleBaseModule } from '@rule-base/rule-base.module';

import { RuleTypeModule } from '@rule-type/rule-type.module';

import { AccountModule } from '@account/account.module';

import { CategoryModule } from '@category/category.module';

import { RuleController } from '@rule/infrastructure/controllers/rule.controller';
import { RULE_REPOSITORY } from '@rule/domain/rule-repository.token';
import { GetRulesUseCase } from '@rule/application/use-cases/get-rules/get-rules.use-case';
import { CreateRuleUseCase } from '@rule/application/use-cases/create-rule/create-rule.use-case';
import { UpdateRuleUseCase } from '@rule/application/use-cases/update-rule/update-rule.use-case';
import { DeleteRuleUseCase } from '@rule/application/use-cases/delete-rule/delete-rule.use-case';
import { RuleRecordTypeOrmEntity } from '@rule/infrastructure/postgres/entities/rule-record.typeorm-entity';
import { RuleRecordTypeOrmRepository } from '@rule/infrastructure/postgres/repositories/rule-record.typeorm-repository';
import { RuleCategorizationTargetTypeOrmEntity } from '@rule/infrastructure/postgres/entities/rule-categorization-target.typeorm-entity';

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
    forwardRef(() => {
      /* eslint-disable @typescript-eslint/no-require-imports -- cyclic modules; runtime path */
      const ns =
        require('../transaction/transaction.module') as typeof import('@transaction/transaction.module');
      /* eslint-enable @typescript-eslint/no-require-imports */
      return ns.TransactionModule;
    }),
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
  exports: [RULE_REPOSITORY],
})
export class RuleModule {}
