import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTypeOrmEntity } from '../../../../account/infrastructure/postgres/entities/account.typeorm-entity';
import { CategoryTypeOrmEntity } from '../../../../category/infrastructure/postgres/entities/category.typeorm-entity';
import { CurrencyTypeOrmEntity } from '../../../../currency/infrastructure/postgres/entities/currency.typeorm-entity';
import { UserTypeOrmEntity } from '../../../../user/infrastructure/postgres/entities/user.typeorm-entity';
import { Transaction } from '../../../domain/entities/transaction';
import type { ITransactionRepository } from '../../../domain/ports/i-transaction-repository';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { TransactionRecordTypeOrmEntity } from '../entities/transaction.typeorm-entity';
import { TransactionTypeTypeOrmEntity } from '../entities/transaction-type.typeorm-entity';

@Injectable()
export class TransactionRecordTypeOrmRepository implements ITransactionRepository {
  public constructor(
    @InjectRepository(TransactionRecordTypeOrmEntity)
    private readonly repository: Repository<TransactionRecordTypeOrmEntity>,
  ) {}

  public async create(domain: Transaction): Promise<Transaction> {
    const recordDateStr: string = domain.recordDate.toISOString().slice(0, 10);
    const entity: TransactionRecordTypeOrmEntity = this.repository.create({
      id: domain.id,
      amount: domain.amount.toPersistenceString(),
      description: domain.description,
      recordDate: recordDateStr,
      excludeFromStats: domain.excludeFromStats,
      category: { id: domain.categoryId } as CategoryTypeOrmEntity,
      transactionType: {
        id: domain.transactionTypeId,
      } as TransactionTypeTypeOrmEntity,
      currency: { id: domain.currencyId } as CurrencyTypeOrmEntity,
      account: { id: domain.accountId } as AccountTypeOrmEntity,
      user: { id: domain.userId } as UserTypeOrmEntity,
    });
    const saved: TransactionRecordTypeOrmEntity =
      await this.repository.save(entity);
    return TransactionMapper.toDomain(saved);
  }
}
