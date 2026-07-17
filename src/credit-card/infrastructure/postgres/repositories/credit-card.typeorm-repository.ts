import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreditCard } from '@credit-card/domain/entities/credit-card';

import { Repository } from 'typeorm';

import { CreditCardMapper } from '@credit-card/infrastructure/postgres/mappers/credit-card.mapper';

import { CreditCardTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card.typeorm-entity';

import type { CreditCardCreateData } from '@credit-card/domain/ports/types/credit-card-create-data';

import type { CreditCardUpdateData } from '@credit-card/domain/ports/types/credit-card-update-data';

import type { ICreditCardRepository } from '@credit-card/domain/ports/i-credit-card-repository';

import type { CreditCardDeleteOwnedData } from '@credit-card/domain/ports/types/credit-card-delete-owned-data';

import type { CreditCardListByAccountData } from '@credit-card/domain/ports/types/credit-card-list-by-account-data';

import type { CreditCardFindOwnedByUserData } from '@credit-card/domain/ports/types/credit-card-find-owned-by-user-data';

import { CreditCardTierCatalogTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card-tier-catalog.typeorm-entity';

import { CreditCardBrandCatalogTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card-brand-catalog.typeorm-entity';

import { AccountTypeOrmEntity } from '@account/infrastructure/postgres/entities/account.typeorm-entity';

@Injectable()
export class CreditCardTypeOrmRepository implements ICreditCardRepository {
  public constructor(
    @InjectRepository(CreditCardTypeOrmEntity)
    private readonly repository: Repository<CreditCardTypeOrmEntity>,
  ) {}

  public async create(data: CreditCardCreateData): Promise<CreditCard> {
    const entity: CreditCardTypeOrmEntity = this.repository.create({
      account: {
        id: data.accountId,
      } as AccountTypeOrmEntity,
      brand: {
        id: data.brandId,
      } as CreditCardBrandCatalogTypeOrmEntity,
      tier: {
        id: data.tierId,
      } as CreditCardTierCatalogTypeOrmEntity,
      lastSixDigits: data.lastSixDigits,
      expiryMonth: data.expiryMonth,
      expiryYear: data.expiryYear,
      creditLimit:
        data.creditLimit === undefined
          ? null
          : data.creditLimit.toPersistenceString(),
    });
    const saved: CreditCardTypeOrmEntity = await this.repository.save(entity);
    return CreditCardMapper.fromPostgresToDomain(saved);
  }

  public async update(data: CreditCardUpdateData): Promise<CreditCard> {
    const row: CreditCardTypeOrmEntity | null = await this.repository
      .createQueryBuilder('c')
      .innerJoin('c.account', 'a')
      .where('c.id = :id', { id: data.id })
      .andWhere('a.user_id = :userId', { userId: data.ownerUserId })
      .getOne();
    if (row === null) {
      throw new Error('Credit card not found for update');
    }
    row.lastSixDigits = data.lastSixDigits;
    row.expiryMonth = data.expiryMonth;
    row.expiryYear = data.expiryYear;
    row.brand = { id: data.brandId } as CreditCardBrandCatalogTypeOrmEntity;
    row.tier = { id: data.tierId } as CreditCardTierCatalogTypeOrmEntity;
    row.creditLimit =
      data.creditLimit === undefined
        ? null
        : data.creditLimit.toPersistenceString();
    const saved: CreditCardTypeOrmEntity = await this.repository.save(row);
    return CreditCardMapper.fromPostgresToDomain(saved);
  }

  public async deleteOwned(data: CreditCardDeleteOwnedData): Promise<void> {
    const row: CreditCardTypeOrmEntity | null = await this.repository
      .createQueryBuilder('c')
      .innerJoin('c.account', 'a')
      .where('c.id = :id', { id: data.creditCardId })
      .andWhere('a.user_id = :userId', { userId: data.userId })
      .getOne();
    if (row === null) {
      throw new Error('Credit card not found or not owned');
    }
    await this.repository.delete({ id: data.creditCardId });
  }

  public async findOwnedByUser(
    data: CreditCardFindOwnedByUserData,
  ): Promise<CreditCard | undefined> {
    const row: CreditCardTypeOrmEntity | null = await this.repository
      .createQueryBuilder('c')
      .innerJoin('c.account', 'a')
      .where('c.id = :id', { id: data.creditCardId })
      .andWhere('a.user_id = :userId', { userId: data.userId })
      .getOne();
    return row === null ? undefined : CreditCardMapper.fromPostgresToDomain(row);
  }

  public async findAllByAccountAndUser(
    data: CreditCardListByAccountData,
  ): Promise<readonly CreditCard[]> {
    const rows: CreditCardTypeOrmEntity[] = await this.repository
      .createQueryBuilder('c')
      .innerJoin('c.account', 'a')
      .where('c.account_id = :accountId', { accountId: data.accountId })
      .andWhere('a.user_id = :userId', { userId: data.userId })
      .orderBy('c.created_at', 'ASC')
      .getMany();
    return rows.map((r: CreditCardTypeOrmEntity) =>
      CreditCardMapper.fromPostgresToDomain(r),
    );
  }
}
