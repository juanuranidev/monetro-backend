import { Inject, Injectable } from '@nestjs/common';

import { CurrencyEntityDto } from '@currency/application/dtos/entity/currency-entity.dto';
import { CURRENCY_REPOSITORY } from '@currency/domain/currency-repository.token';
import type { ICurrencyRepository } from '@currency/domain/ports/i-currency-repository';

@Injectable()
export class ListCurrenciesUseCase {
  public constructor(
    @Inject(CURRENCY_REPOSITORY)
    private readonly currencyRepository: ICurrencyRepository,
  ) {}

  public async execute(): Promise<CurrencyEntityDto[]> {
    const currencies = await this.currencyRepository.findAll();
    return currencies.map(
      (c) => new CurrencyEntityDto(c.id, c.code, c.symbol, c.name),
    );
  }
}
