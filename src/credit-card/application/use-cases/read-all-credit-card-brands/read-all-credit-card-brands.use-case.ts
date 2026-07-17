import { Inject, Injectable } from '@nestjs/common';

import type { CreditCardBrand } from '@credit-card/domain/entities/credit-card-brand';

import { CreditCardCatalogItemResponseDto } from '@credit-card/application/dtos/read-all-credit-card-brands/credit-card-catalog-item-response.dto';

import { ReadAllCreditCardBrandsResponseDto } from '@credit-card/application/dtos/read-all-credit-card-brands/read-all-credit-card-brands-response.dto';

import { CREDIT_CARD_BRAND_CATALOG_REPOSITORY } from '@credit-card/domain/credit-card-brand-catalog-repository.token';

import type { ReadAllCreditCardBrandsRequestDto } from '@credit-card/application/dtos/read-all-credit-card-brands/read-all-credit-card-brands-request.dto';

import type { ICreditCardBrandCatalogRepository } from '@credit-card/domain/ports/i-credit-card-brand-catalog-repository';

@Injectable()
export class ReadAllCreditCardBrandsUseCase {
  public constructor(
    @Inject(CREDIT_CARD_BRAND_CATALOG_REPOSITORY)
    private readonly repository: ICreditCardBrandCatalogRepository,
  ) {}

  public async execute(
    input: ReadAllCreditCardBrandsRequestDto,
  ): Promise<ReadAllCreditCardBrandsResponseDto> {
    void input;
    const rows: readonly CreditCardBrand[] = await this.repository.findAll();
    const items: CreditCardCatalogItemResponseDto[] = rows.map(
      (row: CreditCardBrand) =>
        Object.assign(new CreditCardCatalogItemResponseDto(), {
          id: row.id,
          key: row.key,
          displayNameEs: row.displayNameEs,
        }),
    );
    return Object.assign(new ReadAllCreditCardBrandsResponseDto(), {
      items,
    });
  }
}
