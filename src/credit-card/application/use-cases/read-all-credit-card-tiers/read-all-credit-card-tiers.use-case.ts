import { Inject, Injectable } from '@nestjs/common';

import type { CreditCardTier } from '@credit-card/domain/entities/credit-card-tier';

import { CreditCardCatalogItemResponseDto } from '@credit-card/application/dtos/read-all-credit-card-brands/credit-card-catalog-item-response.dto';

import { ReadAllCreditCardTiersResponseDto } from '@credit-card/application/dtos/read-all-credit-card-tiers/read-all-credit-card-tiers-response.dto';

import { CREDIT_CARD_TIER_CATALOG_REPOSITORY } from '@credit-card/domain/credit-card-tier-catalog-repository.token';

import type { ReadAllCreditCardTiersRequestDto } from '@credit-card/application/dtos/read-all-credit-card-tiers/read-all-credit-card-tiers-request.dto';

import type { ICreditCardTierCatalogRepository } from '@credit-card/domain/ports/i-credit-card-tier-catalog-repository';

@Injectable()
export class ReadAllCreditCardTiersUseCase {
  public constructor(
    @Inject(CREDIT_CARD_TIER_CATALOG_REPOSITORY)
    private readonly repository: ICreditCardTierCatalogRepository,
  ) {}

  public async execute(
    input: ReadAllCreditCardTiersRequestDto,
  ): Promise<ReadAllCreditCardTiersResponseDto> {
    void input;
    const rows: readonly CreditCardTier[] = await this.repository.findAll();
    const items: CreditCardCatalogItemResponseDto[] = rows.map(
      (row: CreditCardTier) =>
        Object.assign(new CreditCardCatalogItemResponseDto(), {
          id: row.id,
          key: row.key,
          displayNameEs: row.displayNameEs,
        }),
    );
    return Object.assign(new ReadAllCreditCardTiersResponseDto(), {
      items,
    });
  }
}
