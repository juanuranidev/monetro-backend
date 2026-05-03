import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';

import { Account, type AccountCreateData } from '@account/domain/entities/account';
import { AccountMapper } from '@account/infrastructure/postgres/mappers/account.mapper';
import { AccountTypeOrmEntity } from '@account/infrastructure/postgres/entities/account.typeorm-entity';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';

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
      currencyId: data.currencyId,
      userId: data.userId,
    });
    const saved: AccountTypeOrmEntity = await this.repository.save(entity);
    return AccountMapper.fromPostgresToDomain(saved);
  }

  public async update(domain: Account): Promise<Account> {
    const entity: AccountTypeOrmEntity | null = await this.repository.findOne({
      where: { id: domain.id, userId: domain.userId },
    });
    if (entity === null) {
      throw new NotFoundException('Account not found');
    }
    entity.name = domain.name;
    entity.identifier = domain.identifier;
    entity.icon = domain.icon ?? null;
    entity.excludeFromStats = domain.excludeFromStats;
    entity.currencyId = domain.currencyId;
    const saved: AccountTypeOrmEntity = await this.repository.save(entity);
    return AccountMapper.fromPostgresToDomain(saved);
  }

  public async findAllByUserId(userId: string): Promise<Account[]> {
    const rows: AccountTypeOrmEntity[] = await this.repository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
    return rows.map((row: AccountTypeOrmEntity) =>
      AccountMapper.fromPostgresToDomain(row),
    );
  }

  public async findOwnedByUser(
    accountId: string,
    userId: string,
  ): Promise<Account | undefined> {
    const row: AccountTypeOrmEntity | null = await this.repository.findOne({
      where: { id: accountId, userId },
    });
    return row === null ? undefined : AccountMapper.fromPostgresToDomain(row);
  }
}
