import { Inject, Injectable } from '@nestjs/common';

import { CURRENCY_REPOSITORY } from '@currency/domain/currency-repository.token';
import { ListCurrenciesResultDto } from '@currency/application/dtos/list-currencies/list-currencies-response.dto';
import type { ICurrencyRepository } from '@currency/domain/ports/i-currency-repository';
import type { ListCurrenciesRequestDto } from '@currency/application/dtos/list-currencies/list-currencies-request.dto';

@Injectable()
export class ListCurrenciesUseCase {
  public constructor(
    @Inject(CURRENCY_REPOSITORY)
    private readonly currencyRepository: ICurrencyRepository,
  ) {}

  public async execute(
    input: ListCurrenciesRequestDto,
  ): Promise<ListCurrenciesResultDto[]> {
    void input;
    const currencies = await this.currencyRepository.findAll();
    return currencies.map((c) => {
      const row: ListCurrenciesResultDto = new ListCurrenciesResultDto();
      row.id = c.id;
      row.code = c.code;
      row.symbol = c.symbol;
      row.name = c.name;
      return row;
    });
  }
}
