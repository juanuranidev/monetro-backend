import { Module } from '@nestjs/common';
import { CurrencyModule } from '../../../currency/currency.module';
import { CreateAccountUseCase } from '../../application/use-cases/create-account/create-account.use-case';
import { ACCOUNT_REPOSITORY } from '../../domain/account-repository.token';
import { AccountController } from '../controllers/account.controller';
import { AccountMongoMemoryStore } from './account-mongo-memory.store';
import { AccountMongoSimulatedRepository } from './repositories/account.mongo-simulated-repository';

/**
 * Drop-in replacement for AccountModule using a simulated MongoDB repository.
 * Wire this module instead of AccountModule when experimenting with another database.
 */
@Module({
  imports: [CurrencyModule],
  controllers: [AccountController],
  providers: [
    AccountMongoMemoryStore,
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: AccountMongoSimulatedRepository,
    },
    CreateAccountUseCase,
  ],
  exports: [ACCOUNT_REPOSITORY],
})
export class AccountMongoModule {}
