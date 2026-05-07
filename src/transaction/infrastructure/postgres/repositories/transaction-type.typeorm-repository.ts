import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TransactionType } from '@transaction/domain/entities/transaction-type';
import { TransactionTypeMapper } from '@transaction/infrastructure/postgres/mappers/transaction-type.mapper';
import { TransactionTypeTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-type.typeorm-entity';
import type { ITransactionTypeRepository } from '@transaction/domain/ports/i-transaction-type-repository';

@Injectable()
export class TransactionTypeTypeOrmRepository implements ITransactionTypeRepository {
  public constructor(
    @InjectRepository(TransactionTypeTypeOrmEntity)
    private readonly repository: Repository<TransactionTypeTypeOrmEntity>,
  ) {}

  public async findAll(): Promise<readonly TransactionType[]> {
    const rows: TransactionTypeTypeOrmEntity[] = await this.repository.find({
      order: { key: 'ASC' },
    });
    return rows.map((row) => TransactionTypeMapper.fromPostgresToDomain(row));
  }

  public async findByKey(key: string): Promise<TransactionType | undefined> {
    const normalized: string = key.trim().toLowerCase();
    const row: TransactionTypeTypeOrmEntity | null =
      await this.repository.findOne({
        where: { key: normalized },
      });
    return row === null
      ? undefined
      : TransactionTypeMapper.fromPostgresToDomain(row);
  }
}
