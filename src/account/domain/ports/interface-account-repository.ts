import type { Account } from '@account/domain/entities/account';

export interface IAccountRepository {
  create(account: Account): Promise<Account>;
  findOwnedByUser(
    accountId: string,
    userId: string,
  ): Promise<Account | undefined>;
}
