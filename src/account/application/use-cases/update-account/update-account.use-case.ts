import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { Account } from '@account/domain/entities/account';
import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';
import { CreateAccountResponseDto } from '@account/application/dtos/create-account/create-account-response.dto';
import type { UpdateAccountBodyDto } from '@account/application/dtos/update-account/update-account-body.dto';

import { CURRENCY_REPOSITORY } from '@currency/domain/currency-repository.token';
import type { ICurrencyRepository } from '@currency/domain/ports/i-currency-repository';

/**
 * Updates an account owned by the user. At least one field in the body must be provided.
 */
@Injectable()
export class UpdateAccountUseCase {
  public constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(CURRENCY_REPOSITORY)
    private readonly currencyRepository: ICurrencyRepository,
  ) {}

  public async execute(input: {
    readonly accountId: string;
    readonly userId: string;
    readonly body: UpdateAccountBodyDto;
  }): Promise<CreateAccountResponseDto> {
    const patch: UpdateAccountBodyDto = input.body;
    if (!this.hasPatchFields(patch)) {
      throw new BadRequestException('No fields to update');
    }
    const existing: Account | undefined =
      await this.accountRepository.findOwnedByUser(
        input.accountId,
        input.userId,
      );
    if (existing === undefined) {
      throw new NotFoundException('Account not found');
    }
    let currencyId: string = existing.currencyId;
    if (patch.currencyCode !== undefined) {
      const currency = await this.currencyRepository.findByCode(
        patch.currencyCode.toUpperCase(),
      );
      if (currency === undefined) {
        throw new BadRequestException('Unknown currency code');
      }
      currencyId = currency.id;
    }
    const name: string =
      patch.name !== undefined ? patch.name.trim() : existing.name;
    const identifier: string =
      patch.identifier !== undefined
        ? patch.identifier.trim()
        : existing.identifier;
    let icon: string | undefined = existing.icon;
    if (patch.icon !== undefined) {
      const trimmed: string = patch.icon.trim();
      icon = trimmed.length > 0 ? trimmed : undefined;
    }
    const excludeFromStats: boolean =
      patch.excludeFromStats !== undefined
        ? patch.excludeFromStats
        : existing.excludeFromStats;
    const updated: Account = new Account(
      existing.id,
      name,
      identifier,
      icon,
      excludeFromStats,
      currencyId,
      existing.userId,
    );
    const saved: Account = await this.accountRepository.update(updated);
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

  private hasPatchFields(patch: UpdateAccountBodyDto): boolean {
    return (
      patch.name !== undefined ||
      patch.identifier !== undefined ||
      patch.icon !== undefined ||
      patch.excludeFromStats !== undefined ||
      patch.currencyCode !== undefined
    );
  }
}
