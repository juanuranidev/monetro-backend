import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from '@account/account.module';

import { CategoryModule } from '@category/category.module';

import { CurrencyModule } from '@currency/currency.module';

import { TransactionController } from '@transaction/infrastructure/controllers/transaction.controller';
import { TransactionTypeController } from '@transaction/infrastructure/controllers/transaction-type.controller';
import { TRANSACTION_REPOSITORY } from '@transaction/domain/transaction-repository.token';
import { CreateTransactionUseCase } from '@transaction/application/use-cases/create-transaction/create-transaction.use-case';
import { GetTransactionsUseCase } from '@transaction/application/use-cases/get-transactions/get-transactions.use-case';
import { UpdateTransactionUseCase } from '@transaction/application/use-cases/update-transaction/update-transaction.use-case';
import { ReadAllTransactionTypesUseCase } from '@transaction/application/use-cases/read-all-transaction-types/read-all-transaction-types.use-case';
import { TRANSACTION_TYPE_REPOSITORY } from '@transaction/domain/transaction-type-repository.token';
import { TransactionCategoryTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-category.typeorm-entity';
import { TransactionTypeTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-type.typeorm-entity';
import { TransactionRecordTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction.typeorm-entity';
import { TransactionTypeTypeOrmRepository } from '@transaction/infrastructure/postgres/repositories/transaction-type.typeorm-repository';
import { TransactionRecordTypeOrmRepository } from '@transaction/infrastructure/postgres/repositories/transaction.typeorm-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionRecordTypeOrmEntity,
      TransactionCategoryTypeOrmEntity,
      TransactionTypeTypeOrmEntity,
    ]),
    CurrencyModule,
    CategoryModule,
    AccountModule,
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
    CreateTransactionUseCase,
    GetTransactionsUseCase,
    UpdateTransactionUseCase,
    ReadAllTransactionTypesUseCase,
  ],
  exports: [TRANSACTION_REPOSITORY, TRANSACTION_TYPE_REPOSITORY],
})
export class TransactionModule {}
