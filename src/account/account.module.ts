import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { AccountController } from '@account/infrastructure/controllers/account.controller';
import { GetAccountUseCase } from '@account/application/use-cases/get-account/get-account.use-case';
import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import { GetAccountsUseCase } from '@account/application/use-cases/get-accounts/get-accounts.use-case';
import { CreateAccountUseCase } from '@account/application/use-cases/create-account/create-account.use-case';
import { UpdateAccountUseCase } from '@account/application/use-cases/update-account/update-account.use-case';
import { AccountTypeOrmEntity } from '@account/infrastructure/postgres/entities/account.typeorm-entity';
import { AccountTypeOrmRepository } from '@account/infrastructure/postgres/repositories/account.typeorm-repository';

import { CurrencyModule } from '@currency/currency.module';

import { TransactionModule } from '@transaction/transaction.module';

/**
 * Relational storage via TypeORM under infrastructure/postgres (PostgreSQL).
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AccountTypeOrmEntity]),
    CurrencyModule,
    forwardRef(() => TransactionModule),
  ],
  controllers: [AccountController],
  providers: [
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: AccountTypeOrmRepository,
    },
    CreateAccountUseCase,
    GetAccountsUseCase,
    GetAccountUseCase,
    UpdateAccountUseCase,
  ],
  exports: [ACCOUNT_REPOSITORY],
})
export class AccountModule {}
