import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListCurrenciesUseCase } from './application/use-cases/list-currencies/list-currencies.use-case';
import { CURRENCY_REPOSITORY } from './domain/currency-repository.token';
import { CurrencyController } from './infrastructure/controllers/currency.controller';
import { CurrencyTypeOrmEntity } from './infrastructure/postgres/entities/currency.typeorm-entity';
import { CurrencyTypeOrmRepository } from './infrastructure/postgres/repositories/currency.typeorm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyTypeOrmEntity])],
  controllers: [CurrencyController],
  providers: [
    {
      provide: CURRENCY_REPOSITORY,
      useClass: CurrencyTypeOrmRepository,
    },
    ListCurrenciesUseCase,
  ],
  exports: [CURRENCY_REPOSITORY],
})
export class CurrencyModule {}
