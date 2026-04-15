import type { Account } from '@account/domain/entities/account';

export interface IAccountRepository {
  create(account: Account): Promise<Account>;
  update(account: Account): Promise<Account>;
  findAllByUserId(userId: string): Promise<Account[]>;
  findOwnedByUser(
    accountId: string,
    userId: string,
  ): Promise<Account | undefined>;
}
