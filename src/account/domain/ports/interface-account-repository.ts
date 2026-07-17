import type { Account } from '@account/domain/entities/account';
import type { AccountCreateData } from '@account/domain/ports/types/account-create-data';
import type { AccountUpdateData } from '@account/domain/ports/types/account-update-data';
import type { AccountListByUserIdData } from '@account/domain/ports/types/account-list-by-user-id-data';
import type { AccountFindOwnedByUserData } from '@account/domain/ports/types/account-find-owned-by-user-data';

export interface IAccountRepository {
  create(data: AccountCreateData): Promise<Account>;

  update(data: AccountUpdateData): Promise<Account>;

  findAllByUserId(data: AccountListByUserIdData): Promise<Account[]>;

  findOwnedByUser(
    data: AccountFindOwnedByUserData,
  ): Promise<Account | undefined>;
}
