import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from '@account/account.module';

import { CategoryModule } from '@category/category.module';

import { RuleController } from '@rule/infrastructure/controllers/rule.controller';
import { RULE_REPOSITORY } from '@rule/domain/rule-repository.token';
import { CreateRuleUseCase } from '@rule/application/use-cases/create-rule/create-rule.use-case';
import { RuleTypeOrmEntity } from '@rule/infrastructure/postgres/entities/rule.typeorm-entity';
import { RuleTypeOrmRepository } from '@rule/infrastructure/postgres/repositories/rule.typeorm-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RuleTypeOrmEntity]),
    CategoryModule,
    AccountModule,
    // AccountMongoModule,
  ],
  controllers: [RuleController],
  providers: [
    {
      provide: RULE_REPOSITORY,
      useClass: RuleTypeOrmRepository,
    },
    CreateRuleUseCase,
  ],
})
export class RuleModule {}
