import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Transaction } from '@transaction/domain/entities/transaction';
import { TransactionMapper } from '@transaction/infrastructure/postgres/mappers/transaction.mapper';
import type { ITransactionRepository } from '@transaction/domain/ports/i-transaction-repository';
import { TransactionRecordTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction.typeorm-entity';

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
      categoryId: domain.categoryId,
      transactionTypeId: domain.transactionTypeId,
      currencyId: domain.currencyId,
      accountId: domain.accountId,
      userId: domain.userId,
    });
    const saved: TransactionRecordTypeOrmEntity =
      await this.repository.save(entity);
    return TransactionMapper.fromPostgresToDomain(saved);
  }
}
