import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import { TransactionMapper } from '@transaction/infrastructure/postgres/mappers/transaction.mapper';
import type { ITransactionRepository } from '@transaction/domain/ports/i-transaction-repository';
import { TransactionRecordTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction.typeorm-entity';
import { TransactionCategoryTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-category.typeorm-entity';
import {
  Transaction,
  type TransactionCreateData,
} from '@transaction/domain/entities/transaction';

@Injectable()
export class TransactionRecordTypeOrmRepository implements ITransactionRepository {
  public constructor(
    @InjectRepository(TransactionRecordTypeOrmEntity)
    private readonly repository: Repository<TransactionRecordTypeOrmEntity>,
    @InjectRepository(TransactionCategoryTypeOrmEntity)
    private readonly categoryLinkRepository: Repository<TransactionCategoryTypeOrmEntity>,
  ) {}

  public async create(data: TransactionCreateData): Promise<Transaction> {
    const categoryIds: string[] = this.normalizeCategoryIds(data.categoryIds);
    const entity: TransactionRecordTypeOrmEntity = this.repository.create({
      amount: data.amount.toPersistenceString(),
      description: data.description,
      recordDate: data.recordDate,
      excludeFromStats: data.excludeFromStats,
      transactionTypeId: data.transactionTypeId,
      currencyId: data.currencyId,
      accountId: data.accountId,
    });
    const saved: TransactionRecordTypeOrmEntity =
      await this.repository.save(entity);
    await this.replaceCategoryLinks(saved.id, categoryIds);
    return TransactionMapper.fromPostgresToDomain(saved, categoryIds);
  }

  public async findAllByUserId(
    userId: string,
  ): Promise<readonly Transaction[]> {
    const rows: TransactionRecordTypeOrmEntity[] = await this.repository
      .createQueryBuilder('t')
      .innerJoin('t.account', 'a')
      .where('a.user_id = :userId', { userId })
      .orderBy('t.record_date', 'DESC')
      .addOrderBy('t.created_at', 'DESC')
      .getMany();
    if (rows.length === 0) {
      return [];
    }
    const idMap: Map<string, string[]> =
      await this.loadCategoryIdsByTransactionIds(rows.map((r) => r.id));
    return rows.map((row) =>
      TransactionMapper.fromPostgresToDomain(row, idMap.get(row.id) ?? []),
    );
  }

  public async findOwnedByUser(
    transactionId: string,
    userId: string,
  ): Promise<Transaction | undefined> {
    const row: TransactionRecordTypeOrmEntity | null = await this.repository
      .createQueryBuilder('t')
      .innerJoin('t.account', 'a')
      .where('t.id = :transactionId', { transactionId })
      .andWhere('a.user_id = :userId', { userId })
      .getOne();
    if (row === null) {
      return undefined;
    }
    const categoryIds: string[] = await this.loadCategoryIdsForTransaction(
      row.id,
    );
    return TransactionMapper.fromPostgresToDomain(row, categoryIds);
  }

  public async update(
    domain: Transaction,
    ownerUserId: string,
  ): Promise<Transaction> {
    const entity: TransactionRecordTypeOrmEntity | null = await this.repository
      .createQueryBuilder('t')
      .innerJoin('t.account', 'a')
      .where('t.id = :id', { id: domain.id })
      .andWhere('a.user_id = :userId', { userId: ownerUserId })
      .getOne();
    if (entity === null) {
      throw new Error('Transaction not found for update');
    }
    const categoryIds: string[] = this.normalizeCategoryIds(domain.categoryIds);
    entity.amount = domain.amount.toPersistenceString();
    entity.description = domain.description;
    entity.recordDate = domain.recordDate;
    entity.excludeFromStats = domain.excludeFromStats;
    entity.transactionTypeId = domain.transactionTypeId;
    entity.currencyId = domain.currencyId;
    entity.accountId = domain.accountId;
    const saved: TransactionRecordTypeOrmEntity =
      await this.repository.save(entity);
    await this.replaceCategoryLinks(saved.id, categoryIds);
    return TransactionMapper.fromPostgresToDomain(saved, categoryIds);
  }

  public async countByAccountId(accountId: string): Promise<number> {
    return this.repository.count({ where: { accountId } });
  }

  private normalizeCategoryIds(categoryIds: readonly string[]): string[] {
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
    const rows: TransactionCategoryTypeOrmEntity[] = categoryIds.map(
      (categoryId) =>
        this.categoryLinkRepository.create({ transactionId, categoryId }),
    );
    await this.categoryLinkRepository.save(rows);
  }
}
