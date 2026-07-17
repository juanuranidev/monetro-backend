import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';

import type { Account } from '@account/domain/entities/account';
import { AccountMapper } from '@account/infrastructure/postgres/mappers/account.mapper';
import { AccountTypeOrmEntity } from '@account/infrastructure/postgres/entities/account.typeorm-entity';
import type { AccountCreateData } from '@account/domain/ports/types/account-create-data';
import type { AccountUpdateData } from '@account/domain/ports/types/account-update-data';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';
import type { AccountListByUserIdData } from '@account/domain/ports/types/account-list-by-user-id-data';
import type { AccountFindOwnedByUserData } from '@account/domain/ports/types/account-find-owned-by-user-data';

import { CurrencyTypeOrmEntity } from '@currency/infrastructure/postgres/entities/currency.typeorm-entity';

import { UserTypeOrmEntity } from '@user/infrastructure/postgres/entities/user.typeorm-entity';

@Injectable()
export class AccountTypeOrmRepository implements IAccountRepository {
  public constructor(
    @InjectRepository(AccountTypeOrmEntity)
    private readonly repository: Repository<AccountTypeOrmEntity>,
  ) {}

  public async create(data: AccountCreateData): Promise<Account> {
    const entity: AccountTypeOrmEntity = this.repository.create({
      name: data.name,
      identifier: data.identifier,
      icon: data.icon ?? null,
      excludeFromStats: data.excludeFromStats,
      currency: { id: data.currencyId } as CurrencyTypeOrmEntity,
      user: { id: data.userId } as UserTypeOrmEntity,
    });
    const saved: AccountTypeOrmEntity = await this.repository.save(entity);
    return AccountMapper.fromPostgresToDomain(saved);
  }

  public async update(data: AccountUpdateData): Promise<Account> {
    const entity: AccountTypeOrmEntity | null = await this.repository.findOne({
      where: { id: data.id, user: { id: data.userId } },
    });
    if (entity === null) {
      throw new NotFoundException('Account not found');
    }
    entity.name = data.name;
    entity.identifier = data.identifier;
    entity.icon = data.icon ?? null;
    entity.excludeFromStats = data.excludeFromStats;
    entity.currency = { id: data.currencyId } as CurrencyTypeOrmEntity;
    const saved: AccountTypeOrmEntity = await this.repository.save(entity);
    return AccountMapper.fromPostgresToDomain(saved);
  }

  public async findAllByUserId(
    data: AccountListByUserIdData,
  ): Promise<Account[]> {
    const rows: AccountTypeOrmEntity[] = await this.repository.find({
      where: { user: { id: data.userId } },
      order: { name: 'ASC' },
    });
    return rows.map((row: AccountTypeOrmEntity) =>
      AccountMapper.fromPostgresToDomain(row),
    );
  }

  public async findOwnedByUser(
    data: AccountFindOwnedByUserData,
  ): Promise<Account | undefined> {
    const row: AccountTypeOrmEntity | null = await this.repository.findOne({
      where: { id: data.accountId, user: { id: data.userId } },
    });
    return row === null ? undefined : AccountMapper.fromPostgresToDomain(row);
  }
}
