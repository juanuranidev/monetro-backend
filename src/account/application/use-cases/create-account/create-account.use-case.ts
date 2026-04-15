import { randomUUID } from 'crypto';

import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import { Account } from '@account/domain/entities/account';
import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';
import { CreateAccountResponseDto } from '@account/application/dtos/create-account/create-account-response.dto';
import type { CreateAccountRequestDto } from '@account/application/dtos/create-account/create-account-request.dto';

import { CURRENCY_REPOSITORY } from '@currency/domain/currency-repository.token';
import type { ICurrencyRepository } from '@currency/domain/ports/i-currency-repository';

@Injectable()
export class CreateAccountUseCase {
  public constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(CURRENCY_REPOSITORY)
    private readonly currencyRepository: ICurrencyRepository,
  ) {}

  public async execute(
    input: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    const currency = await this.currencyRepository.findByCode(
      input.currencyCode.toUpperCase(),
    );
    if (currency === undefined) {
      throw new BadRequestException('Unknown currency code');
    }
    const excludeFromStats: boolean = input.excludeFromStats ?? false;
    const account: Account = new Account(
      randomUUID(),
      input.name.trim(),
      input.identifier.trim(),
      input.icon?.trim(),
      excludeFromStats,
      currency.id,
      input.userId,
    );
    const saved: Account = await this.accountRepository.create(account);
    const response: CreateAccountResponseDto = new CreateAccountResponseDto();
    response.id = saved.id;
    response.name = saved.name;
    response.identifier = saved.identifier;
    response.excludeFromStats = saved.excludeFromStats;
    response.currencyId = saved.currencyId;
    if (saved.icon !== undefined) {
      response.icon = saved.icon;
    }
    return response;
  }
}
