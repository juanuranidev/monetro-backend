import { CreditCard } from '@credit-card/domain/entities/credit-card';

import type { CreditCardTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card.typeorm-entity';

import { MoneyAmount } from '@shared/domain/value-objects/money-amount';

export class CreditCardMapper {
  /**
   * Maps a persisted credit card row to the domain entity.
   */
  public static fromPostgresToDomain(entity: CreditCardTypeOrmEntity): CreditCard {
    const rawLimit: string | null | undefined = entity.creditLimit;
    const creditLimit: MoneyAmount | undefined =
      rawLimit === null || rawLimit === undefined
        ? undefined
        : MoneyAmount.fromString(rawLimit);
    return new CreditCard(
      entity.id,
      entity.accountId,
      entity.brandId,
      entity.tierId,
      entity.lastSixDigits,
      Number(entity.expiryMonth),
      Number(entity.expiryYear),
      creditLimit,
    );
  }
}
