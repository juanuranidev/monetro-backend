import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import {
  Transaction,
  type TransactionCreateData,
} from '@transaction/domain/entities/transaction';
import { TransactionMapper } from '@transaction/infrastructure/postgres/mappers/transaction.mapper';
import type { ITransactionRepository } from '@transaction/domain/ports/i-transaction-repository';
import { TransactionCategoryTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-category.typeorm-entity';
import { TransactionRecordTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction.typeorm-entity';

@Injectable()
export class TransactionRecordTypeOrmRepository implements ITransactionRepository {
  public constructor(
    @InjectRepository(TransactionRecordTypeOrmEntity)
    private readonly repository: Repository<TransactionRecordTypeOrmEntity>,
    @InjectRepository(TransactionCategoryTypeOrmEntity)
    private readonly categoryLinkRepository: Repository<TransactionCategoryTypeOrmEntity>,
  ) {}

  public async create(data: TransactionCreateData): Promise<Transaction> {
    const recordDateStr: string = data.recordDate.toISOString().slice(0, 10);
    const categoryIds: string[] = this.normalizeCategoryIds(data.categoryIds);
    const entity: TransactionRecordTypeOrmEntity = this.repository.create({
      amount: data.amount.toPersistenceString(),
      description: data.description,
      recordDate: recordDateStr,
      excludeFromStats: data.excludeFromStats,
      transactionTypeId: data.transactionTypeId,
      currencyId: data.currencyId,
      accountId: data.accountId,
      userId: data.userId,
    });
    const saved: TransactionRecordTypeOrmEntity = await this.repository.save(entity);
    await this.replaceCategoryLinks(saved.id, categoryIds);
    return TransactionMapper.fromPostgresToDomain(saved, categoryIds);
  }

  public async findAllByUserId(userId: string): Promise<readonly Transaction[]> {
    const rows: TransactionRecordTypeOrmEntity[] = await this.repository.find({
      where: { userId },
      order: { recordDate: 'DESC', createdAt: 'DESC' },
    });
    if (rows.length === 0) {
      return [];
    }
    const idMap: Map<string, string[]> = await this.loadCategoryIdsByTransactionIds(
      rows.map((r) => r.id),
    );
    return rows.map((row) =>
      TransactionMapper.fromPostgresToDomain(
        row,
        idMap.get(row.id) ?? [],
      ),
    );
  }

  public async findOwnedByUser(
    transactionId: string,
    userId: string,
  ): Promise<Transaction | undefined> {
    const row: TransactionRecordTypeOrmEntity | null =
      await this.repository.findOne({
        where: { id: transactionId, userId },
      });
    if (row === null) {
      return undefined;
    }
    const categoryIds: string[] = await this.loadCategoryIdsForTransaction(row.id);
    return TransactionMapper.fromPostgresToDomain(row, categoryIds);
  }

  public async update(domain: Transaction): Promise<Transaction> {
    const categoryIds: string[] = this.normalizeCategoryIds(domain.categoryIds);
    const entity: TransactionRecordTypeOrmEntity =
      await this.repository.findOneOrFail({
        where: { id: domain.id, userId: domain.userId },
      });
    const recordDateStr: string = domain.recordDate.toISOString().slice(0, 10);
    entity.amount = domain.amount.toPersistenceString();
    entity.description = domain.description;
    entity.recordDate = recordDateStr;
    entity.excludeFromStats = domain.excludeFromStats;
    entity.transactionTypeId = domain.transactionTypeId;
    entity.currencyId = domain.currencyId;
    entity.accountId = domain.accountId;
    const saved: TransactionRecordTypeOrmEntity = await this.repository.save(entity);
    await this.replaceCategoryLinks(saved.id, categoryIds);
    return TransactionMapper.fromPostgresToDomain(saved, categoryIds);
  }

  private normalizeCategoryIds(
    categoryIds: readonly string[],
  ): string[] {
    return [...new Set(categoryIds)].sort();
  }

  private async loadCategoryIdsForTransaction(
    transactionId: string,
  ): Promise<string[]> {
    const links: TransactionCategoryTypeOrmEntity[] =
      await this.categoryLinkRepository.find({
        where: { transactionId },
        order: { categoryId: 'ASC' },
      });
    return links.map((l) => l.categoryId);
  }

  private async loadCategoryIdsByTransactionIds(
    transactionIds: string[],
  ): Promise<Map<string, string[]>> {
    const result: Map<string, string[]> = new Map();
    for (const id of transactionIds) {
      result.set(id, []);
    }
    if (transactionIds.length === 0) {
      return result;
    }
    const links: TransactionCategoryTypeOrmEntity[] =
      await this.categoryLinkRepository.find({
        where: { transactionId: In(transactionIds) },
        order: { categoryId: 'ASC' },
      });
    for (const link of links) {
      const list: string[] = result.get(link.transactionId) ?? [];
      list.push(link.categoryId);
      result.set(link.transactionId, list);
    }
    for (const id of transactionIds) {
      const list: string[] = result.get(id) ?? [];
      list.sort();
      result.set(id, list);
    }
    return result;
  }

  private async replaceCategoryLinks(
    transactionId: string,
    categoryIds: string[],
  ): Promise<void> {
    await this.categoryLinkRepository.delete({ transactionId });
    if (categoryIds.length === 0) {
      return;
    }
    const rows: TransactionCategoryTypeOrmEntity[] = categoryIds.map((categoryId) =>
      this.categoryLinkRepository.create({ transactionId, categoryId }),
    );
    await this.categoryLinkRepository.save(rows);
  }
}
