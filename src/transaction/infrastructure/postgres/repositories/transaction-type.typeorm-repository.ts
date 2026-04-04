import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from '../../../domain/entities/transaction-type';
import type { ITransactionTypeRepository } from '../../../domain/ports/i-transaction-type-repository';
import { TransactionTypeMapper } from '../mappers/transaction-type.mapper';
import { TransactionTypeTypeOrmEntity } from '../entities/transaction-type.typeorm-entity';

@Injectable()
export class TransactionTypeTypeOrmRepository implements ITransactionTypeRepository {
  public constructor(
    @InjectRepository(TransactionTypeTypeOrmEntity)
    private readonly repository: Repository<TransactionTypeTypeOrmEntity>,
  ) {}

  public async findByCode(code: string): Promise<TransactionType | undefined> {
    const row: TransactionTypeTypeOrmEntity | null =
      await this.repository.findOne({
        where: { code: code.toUpperCase() },
      });
    return row === null ? undefined : TransactionTypeMapper.toDomain(row);
  }
}
