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
    return currencies.map((c) =>
      Object.assign(new GetCurrenciesResponseDto(), {
        id: c.id,
        key: c.key,
        symbol: c.symbol,
        name: c.name,
      }),
    );
  }
}
