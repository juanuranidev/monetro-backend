import { Inject, Injectable } from '@nestjs/common';

import { CURRENCY_REPOSITORY } from '@currency/domain/currency-repository.token';
import { GetCurrenciesResponseDto } from '@currency/application/dtos/get-currencies/get-currencies-response.dto';
import type { ICurrencyRepository } from '@currency/domain/ports/i-currency-repository';
import type { GetCurrenciesRequestDto } from '@currency/application/dtos/get-currencies/get-currencies-request.dto';

@Injectable()
export class GetCurrenciesUseCase {
  public constructor(
    @Inject(CURRENCY_REPOSITORY)
    private readonly currencyRepository: ICurrencyRepository,
  ) {}

  public async execute(
    input: GetCurrenciesRequestDto,
  ): Promise<GetCurrenciesResponseDto[]> {
    void input;
    const currencies = await this.currencyRepository.findAll();
    return currencies.map((c) => {
      const row: GetCurrenciesResponseDto = new GetCurrenciesResponseDto();
      row.id = c.id;
      row.code = c.code;
      row.symbol = c.symbol;
      row.name = c.name;
      return row;
    });
  }
}
