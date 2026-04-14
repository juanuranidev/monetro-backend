import { randomUUID } from 'crypto';
import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import { Account } from '@account/domain/entities/account';
import { AccountEntityDto } from '@account/application/dtos/entity/account-entity.dto';
import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';
import type { CreateAccountRequestDto } from '@account/application/dtos/request/create-account-request.dto';

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
    userId: string,
    input: CreateAccountRequestDto,
  ): Promise<AccountEntityDto> {
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
      userId,
    );
    const saved: Account = await this.accountRepository.create(account);
    return new AccountEntityDto(
      saved.id,
      saved.name,
      saved.identifier,
      saved.icon,
      saved.excludeFromStats,
      saved.currencyId,
    );
  }
}
