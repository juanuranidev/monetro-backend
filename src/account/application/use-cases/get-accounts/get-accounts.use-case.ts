import { Inject, Injectable } from '@nestjs/common';

import type { Account } from '@account/domain/entities/account';
import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import { GetAccountsResponseDto } from '@account/application/dtos/get-accounts/get-accounts-response.dto';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';
import type { GetAccountsRequestDto } from '@account/application/dtos/get-accounts/get-accounts-request.dto';

/**
 * Returns every account owned by the authenticated user, ordered by name.
 */
@Injectable()
export class GetAccountsUseCase {
  public constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
  ) {}

  public async execute(
    input: GetAccountsRequestDto,
  ): Promise<GetAccountsResponseDto[]> {
    const accounts: Account[] = await this.accountRepository.findAllByUserId({
      userId: input.userId,
    });

    return accounts.map((account: Account) =>
      Object.assign(new GetAccountsResponseDto(), {
        id: account.id,
        name: account.name,
        identifier: account.identifier,
        excludeFromStats: account.excludeFromStats,
        currencyId: account.currencyId,
        ...(account.icon !== undefined ? { icon: account.icon } : {}),
      }),
    );
  }
}
