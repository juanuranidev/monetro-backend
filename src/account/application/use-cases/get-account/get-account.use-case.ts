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
      await this.accountRepository.findOwnedByUser(
        input.accountId,
        input.userId,
      );
    if (account === undefined) {
      throw new NotFoundException('Account not found');
    }
    const response: GetAccountsResponseDto = new GetAccountsResponseDto();
    response.id = account.id;
    response.name = account.name;
    response.identifier = account.identifier;
    response.excludeFromStats = account.excludeFromStats;
    response.currencyId = account.currencyId;
    if (account.icon !== undefined) {
      response.icon = account.icon;
    }
    return response;
  }
}
