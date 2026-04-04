import { Inject, Injectable } from '@nestjs/common';
import type { ICurrencyRepository } from '../../../domain/ports/i-currency-repository';
import { CURRENCY_REPOSITORY } from '../../../domain/currency-repository.token';
import { CurrencyResponseDto } from '../../dtos/response/entity/currency-response.dto';

@Injectable()
export class ListCurrenciesUseCase {
  public constructor(
    @Inject(CURRENCY_REPOSITORY)
    private readonly currencyRepository: ICurrencyRepository,
  ) {}

  public async execute(): Promise<CurrencyResponseDto[]> {
    const currencies = await this.currencyRepository.findAll();
    return currencies.map(
      (c) => new CurrencyResponseDto(c.id, c.code, c.symbol, c.name),
    );
  }
}
