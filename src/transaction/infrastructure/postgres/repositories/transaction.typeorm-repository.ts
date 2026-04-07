import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../domain/entities/transaction';
import type { ITransactionRepository } from '../../../domain/ports/i-transaction-repository';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { TransactionRecordTypeOrmEntity } from '../entities/transaction.typeorm-entity';

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
