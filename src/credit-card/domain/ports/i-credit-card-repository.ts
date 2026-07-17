import type { CreditCard } from '@credit-card/domain/entities/credit-card';

import type { CreditCardCreateData } from '@credit-card/domain/ports/types/credit-card-create-data';

import type { CreditCardUpdateData } from '@credit-card/domain/ports/types/credit-card-update-data';

import type { CreditCardDeleteOwnedData } from '@credit-card/domain/ports/types/credit-card-delete-owned-data';

import type { CreditCardListByAccountData } from '@credit-card/domain/ports/types/credit-card-list-by-account-data';

import type { CreditCardFindOwnedByUserData } from '@credit-card/domain/ports/types/credit-card-find-owned-by-user-data';

export interface ICreditCardRepository {
  create(data: CreditCardCreateData): Promise<CreditCard>;

  update(data: CreditCardUpdateData): Promise<CreditCard>;

  deleteOwned(data: CreditCardDeleteOwnedData): Promise<void>;

  findOwnedByUser(
    data: CreditCardFindOwnedByUserData,
  ): Promise<CreditCard | undefined>;

  findAllByAccountAndUser(
    data: CreditCardListByAccountData,
  ): Promise<readonly CreditCard[]>;
}
