import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from '../currency/currency.module';
import { CreateAccountUseCase } from './application/use-cases/create-account/create-account.use-case';
import { ACCOUNT_REPOSITORY } from './domain/account-repository.token';
import { AccountController } from './infrastructure/controllers/account.controller';
import { AccountTypeOrmEntity } from './infrastructure/postgres/entities/account.typeorm-entity';
import { AccountTypeOrmRepository } from './infrastructure/postgres/repositories/account.typeorm-repository';

/**
 * Relational storage via TypeORM under infrastructure/postgres (PostgreSQL in
 * production; the same mappings work if TypeORM is pointed at SQLite in tests).
 * For a Mongo-style alternative see infrastructure/mongo/account-mongo.module.ts.
 */
@Module({
  imports: [TypeOrmModule.forFeature([AccountTypeOrmEntity]), CurrencyModule],
  controllers: [AccountController],
  providers: [
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: AccountTypeOrmRepository,
    },
    CreateAccountUseCase,
  ],
  exports: [ACCOUNT_REPOSITORY],
})
export class AccountModule {}
