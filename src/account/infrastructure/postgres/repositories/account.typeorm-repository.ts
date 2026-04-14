import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Account } from '@account/domain/entities/account';
import { AccountMapper } from '@account/infrastructure/postgres/mappers/account.mapper';
import { AccountTypeOrmEntity } from '@account/infrastructure/postgres/entities/account.typeorm-entity';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';

@Injectable()
export class AccountTypeOrmRepository implements IAccountRepository {
  public constructor(
    @InjectRepository(AccountTypeOrmEntity)
    private readonly repository: Repository<AccountTypeOrmEntity>,
  ) {}

  public async create(domain: Account): Promise<Account> {
    const entity: AccountTypeOrmEntity = this.repository.create({
      id: domain.id,
      name: domain.name,
      identifier: domain.identifier,
      icon: domain.icon ?? null,
      excludeFromStats: domain.excludeFromStats,
      currencyId: domain.currencyId,
      userId: domain.userId,
    });
    const saved: AccountTypeOrmEntity = await this.repository.save(entity);
    return AccountMapper.fromPostgresToDomain(saved);
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
