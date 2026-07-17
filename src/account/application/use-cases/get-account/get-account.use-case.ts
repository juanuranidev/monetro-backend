import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { Account } from '@account/domain/entities/account';
import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import { GetAccountsResponseDto } from '@account/application/dtos/get-accounts/get-accounts-response.dto';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';
import type { GetAccountRequestDto } from '@account/application/dtos/get-account/get-account-request.dto';

/**
 * Returns a single account when it belongs to the given user.
 */
@Injectable()
export class GetAccountUseCase {
  public constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
  ) {}

  public async execute(
    input: GetAccountRequestDto,
  ): Promise<GetAccountsResponseDto> {
    const account: Account | undefined =
      await this.accountRepository.findOwnedByUser({
        accountId: input.accountId,
        userId: input.userId,
      });
    if (account === undefined) {
      throw new NotFoundException('Account not found');
    }

    return Object.assign(new GetAccountsResponseDto(), {
      id: account.id,
      name: account.name,
      identifier: account.identifier,
      excludeFromStats: account.excludeFromStats,
      currencyId: account.currencyId,
      ...(account.icon !== undefined ? { icon: account.icon } : {}),
    });
  }
}
