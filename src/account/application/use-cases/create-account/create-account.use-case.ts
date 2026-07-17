import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import { type AccountCreateData } from '@account/domain/ports/types/account-create-data';
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
    const currency = await this.currencyRepository.findByKey({
      key: input.currencyKey,
    });
    if (currency === undefined) {
      throw new BadRequestException('Unknown currency key');
    }

    const excludeFromStats: boolean = input.excludeFromStats ?? false;
    const data: AccountCreateData = {
      name: input.name.trim(),
      identifier: input.identifier.trim(),
      icon: input.icon?.trim(),
      excludeFromStats,
      currencyId: currency.id,
      userId: input.userId,
    };

    const saved = await this.accountRepository.create(data);

    return Object.assign(new CreateAccountResponseDto(), {
      id: saved.id,
      name: saved.name,
      identifier: saved.identifier,
      excludeFromStats: saved.excludeFromStats,
      currencyId: saved.currencyId,
      ...(saved.icon !== undefined ? { icon: saved.icon } : {}),
    });
  }
}
