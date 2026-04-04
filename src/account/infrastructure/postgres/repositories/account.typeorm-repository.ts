import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyTypeOrmEntity } from '../../../../currency/infrastructure/postgres/entities/currency.typeorm-entity';
import { UserTypeOrmEntity } from '../../../../user/infrastructure/postgres/entities/user.typeorm-entity';
import { Account } from '../../../domain/entities/account';
import type { IAccountRepository } from '../../../domain/ports/interface-account-repository';
import { AccountMapper } from '../mappers/account.mapper';
import { AccountTypeOrmEntity } from '../entities/account.typeorm-entity';

@Injectable()
export class AccountTypeOrmRepository implements IAccountRepository {
  public constructor(
    @InjectRepository(AccountTypeOrmEntity)
    private readonly repository: Repository<AccountTypeOrmEntity>,
  ) {}

  public async create(domain: Account): Promise<Account> {
    const currencyRef: CurrencyTypeOrmEntity = {
      id: domain.currencyId,
    } as CurrencyTypeOrmEntity;
    const userRef: UserTypeOrmEntity = { id: domain.userId } as UserTypeOrmEntity;
    const entity: AccountTypeOrmEntity = this.repository.create({
      id: domain.id,
      name: domain.name,
      identifier: domain.identifier,
      icon: domain.icon ?? null,
      excludeFromStats: domain.excludeFromStats,
      currency: currencyRef,
      user: userRef,
    });
    const saved: AccountTypeOrmEntity = await this.repository.save(entity);
    return AccountMapper.toDomain(saved);
  }

  public async findOwnedByUser(
    accountId: string,
    userId: string,
  ): Promise<Account | undefined> {
    const row: AccountTypeOrmEntity | null = await this.repository.findOne({
      where: { id: accountId, userId },
    });
    return row === null ? undefined : AccountMapper.toDomain(row);
  }
}
