import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { RuleBaseModule } from '@rule-base/rule-base.module';

import { RuleTypeModule } from '@rule-type/rule-type.module';

import { CreditCardModule } from '@credit-card/credit-card.module';

import { AccountModule } from '@account/account.module';

import { CategoryModule } from '@category/category.module';

import { CurrencyModule } from '@currency/currency.module';

import { TransactionController } from '@transaction/infrastructure/controllers/transaction.controller';
import { TRANSACTION_REPOSITORY } from '@transaction/domain/transaction-repository.token';
import { GetTransactionsUseCase } from '@transaction/application/use-cases/get-transactions/get-transactions.use-case';
import { CreateTransactionUseCase } from '@transaction/application/use-cases/create-transaction/create-transaction.use-case';
import { UpdateTransactionUseCase } from '@transaction/application/use-cases/update-transaction/update-transaction.use-case';
import { TransactionTypeController } from '@transaction/infrastructure/controllers/transaction-type.controller';
import { TRANSACTION_TYPE_REPOSITORY } from '@transaction/domain/transaction-type-repository.token';
import { TransactionTypeTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-type.typeorm-entity';
import { ReadAllTransactionTypesUseCase } from '@transaction/application/use-cases/read-all-transaction-types/read-all-transaction-types.use-case';
import { TransactionRecordTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction.typeorm-entity';
import { TransactionCategoryTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-category.typeorm-entity';
import { TransactionTypeTypeOrmRepository } from '@transaction/infrastructure/postgres/repositories/transaction-type.typeorm-repository';
import { TransactionRecordTypeOrmRepository } from '@transaction/infrastructure/postgres/repositories/transaction.typeorm-repository';
import { ApplyActiveRulesToTransactionDraftService } from '@transaction/application/services/apply-active-rules-to-transaction-draft.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionRecordTypeOrmEntity,
      TransactionCategoryTypeOrmEntity,
      TransactionTypeTypeOrmEntity,
    ]),
    CurrencyModule,
    CategoryModule,
    forwardRef(() => AccountModule),
    forwardRef(() => CreditCardModule),
    RuleTypeModule,
    RuleBaseModule,
    forwardRef(() => {
      /* eslint-disable @typescript-eslint/no-require-imports -- cyclic modules; runtime path */
      const ns =
        require('../rule/rule.module') as typeof import('@rule/rule.module');
      /* eslint-enable @typescript-eslint/no-require-imports */
      return ns.RuleModule;
    }),
  ],
  controllers: [TransactionController, TransactionTypeController],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRecordTypeOrmRepository,
    },
    {
      provide: TRANSACTION_TYPE_REPOSITORY,
      useClass: TransactionTypeTypeOrmRepository,
    },
    ApplyActiveRulesToTransactionDraftService,
    CreateTransactionUseCase,
    GetTransactionsUseCase,
    UpdateTransactionUseCase,
    ReadAllTransactionTypesUseCase,
  ],
  exports: [
    TRANSACTION_REPOSITORY,
    TRANSACTION_TYPE_REPOSITORY,
    GetTransactionsUseCase,
  ],
})
export class TransactionModule {}
