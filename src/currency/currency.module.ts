import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyController } from '@currency/infrastructure/controllers/currency.controller';
import { CURRENCY_REPOSITORY } from '@currency/domain/currency-repository.token';
import { ListCurrenciesUseCase } from '@currency/application/use-cases/list-currencies/list-currencies.use-case';
import { CurrencyTypeOrmEntity } from '@currency/infrastructure/postgres/entities/currency.typeorm-entity';
import { CurrencyTypeOrmRepository } from '@currency/infrastructure/postgres/repositories/currency.typeorm-repository';

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
