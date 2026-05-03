import type {
  Account,
  AccountCreateData,
} from '@account/domain/entities/account';

export interface IAccountRepository {
  create(data: AccountCreateData): Promise<Account>;
  update(account: Account): Promise<Account>;
  findAllByUserId(userId: string): Promise<Account[]>;
  findOwnedByUser(
    accountId: string,
    userId: string,
  ): Promise<Account | undefined>;
}
