import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { GetCreditCardUseCase } from '@credit-card/application/use-cases/get-credit-card/get-credit-card.use-case';

import { ListCreditCardsUseCase } from '@credit-card/application/use-cases/list-credit-cards/list-credit-cards.use-case';

import { CREDIT_CARD_REPOSITORY } from '@credit-card/domain/credit-card-repository.token';

import { CreateCreditCardUseCase } from '@credit-card/application/use-cases/create-credit-card/create-credit-card.use-case';

import { DeleteCreditCardUseCase } from '@credit-card/application/use-cases/delete-credit-card/delete-credit-card.use-case';

import { UpdateCreditCardUseCase } from '@credit-card/application/use-cases/update-credit-card/update-credit-card.use-case';

import { CreditCardTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card.typeorm-entity';

import { CreditCardScopedController } from '@credit-card/infrastructure/controllers/credit-card-scoped.controller';

import { CreditCardCatalogController } from '@credit-card/infrastructure/controllers/credit-card-catalog.controller';

import { CreditCardTypeOrmRepository } from '@credit-card/infrastructure/postgres/repositories/credit-card.typeorm-repository';

import { ReadAllCreditCardTiersUseCase } from '@credit-card/application/use-cases/read-all-credit-card-tiers/read-all-credit-card-tiers.use-case';

import { ReadAllCreditCardBrandsUseCase } from '@credit-card/application/use-cases/read-all-credit-card-brands/read-all-credit-card-brands.use-case';

import { CreditCardTierCatalogTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card-tier-catalog.typeorm-entity';

import { CREDIT_CARD_TIER_CATALOG_REPOSITORY } from '@credit-card/domain/credit-card-tier-catalog-repository.token';

import { CreditCardBrandCatalogTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card-brand-catalog.typeorm-entity';

import { CREDIT_CARD_BRAND_CATALOG_REPOSITORY } from '@credit-card/domain/credit-card-brand-catalog-repository.token';

import { CreditCardTierCatalogTypeOrmRepository } from '@credit-card/infrastructure/postgres/repositories/credit-card-tier-catalog.typeorm-repository';

import { CreditCardBrandCatalogTypeOrmRepository } from '@credit-card/infrastructure/postgres/repositories/credit-card-brand-catalog.typeorm-repository';

import { AccountModule } from '@account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreditCardBrandCatalogTypeOrmEntity,
      CreditCardTierCatalogTypeOrmEntity,
      CreditCardTypeOrmEntity,
    ]),
    forwardRef(() => AccountModule),
  ],
  controllers: [CreditCardCatalogController, CreditCardScopedController],
  providers: [
    {
      provide: CREDIT_CARD_BRAND_CATALOG_REPOSITORY,
      useClass: CreditCardBrandCatalogTypeOrmRepository,
    },
    {
      provide: CREDIT_CARD_TIER_CATALOG_REPOSITORY,
      useClass: CreditCardTierCatalogTypeOrmRepository,
    },
    {
      provide: CREDIT_CARD_REPOSITORY,
      useClass: CreditCardTypeOrmRepository,
    },
    ReadAllCreditCardBrandsUseCase,
    ReadAllCreditCardTiersUseCase,
    CreateCreditCardUseCase,
    ListCreditCardsUseCase,
    GetCreditCardUseCase,
    UpdateCreditCardUseCase,
    DeleteCreditCardUseCase,
  ],
  exports: [CREDIT_CARD_REPOSITORY],
})
export class CreditCardModule {}
