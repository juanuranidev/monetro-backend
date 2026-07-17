import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import { CreditCardTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card.typeorm-entity';

import { AccountTypeOrmEntity } from '@account/infrastructure/postgres/entities/account.typeorm-entity';

import { CurrencyTypeOrmEntity } from '@currency/infrastructure/postgres/entities/currency.typeorm-entity';

import type { Transaction } from '@transaction/domain/entities/transaction';
import { TransactionMapper } from '@transaction/infrastructure/postgres/mappers/transaction.mapper';
import type { TransactionCreateData } from '@transaction/domain/ports/types/transaction-create-data';
import type { TransactionUpdateData } from '@transaction/domain/ports/types/transaction-update-data';
import type { ITransactionRepository } from '@transaction/domain/ports/i-transaction-repository';
import { TransactionTypeTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-type.typeorm-entity';
import { TransactionRecordTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction.typeorm-entity';
import { TransactionCategoryTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-category.typeorm-entity';
import type { TransactionCountByAccountData } from '@transaction/domain/ports/types/transaction-count-by-account-data';
import type { TransactionFindAllByUserIdData } from '@transaction/domain/ports/types/transaction-find-all-by-user-id-data';
import type { TransactionFindOwnedByUserData } from '@transaction/domain/ports/types/transaction-find-owned-by-user-data';

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
    let accountRef: AccountTypeOrmEntity | null = null;
    let creditCardRef: CreditCardTypeOrmEntity | null = null;
    if (data.accountId !== undefined) {
      accountRef = {
        id: data.accountId,
      } as AccountTypeOrmEntity;
    }
    if (data.creditCardId !== undefined) {
      creditCardRef = {
        id: data.creditCardId,
      } as CreditCardTypeOrmEntity;
    }
    const entity: TransactionRecordTypeOrmEntity = this.repository.create({
      amount: data.amount.toPersistenceString(),
      description: data.description,
      recordDate: data.recordDate,
      excludeFromStats: data.excludeFromStats,
      transactionType: {
        id: data.transactionTypeId,
      } as TransactionTypeTypeOrmEntity,
      currency: { id: data.currencyId } as CurrencyTypeOrmEntity,
      account: accountRef,
      creditCard: creditCardRef,
    });
    const saved: TransactionRecordTypeOrmEntity =
      await this.repository.save(entity);
    await this.replaceCategoryLinks(saved.id, categoryIds);
    return TransactionMapper.fromPostgresToDomain(saved, categoryIds);
  }

  public async findAllByUserId(
    data: TransactionFindAllByUserIdData,
  ): Promise<readonly Transaction[]> {
    const qb = this.transactionScopeQueryBuilder(data.userId);
    if (data.accountId !== undefined) {
      qb.andWhere(
        '(t.account_id = :accountScopeId OR cc.account_id = :accountScopeId)',
        { accountScopeId: data.accountId },
      );
    }
    if (data.creditCardId !== undefined) {
      qb.andWhere('t.credit_card_id = :creditCardFilterId', {
        creditCardFilterId: data.creditCardId,
      });
    }
    qb.orderBy('t.record_date', 'DESC').addOrderBy('t.created_at', 'DESC');
    const rows: TransactionRecordTypeOrmEntity[] = await qb.getMany();
    if (rows.length === 0) {
      return [];
    }
    const idMap: Map<string, string[]> =
      await this.loadCategoryIdsByTransactionIds(rows.map((r) => r.id));
    return rows.map((row) =>
      TransactionMapper.fromPostgresToDomain(row, idMap.get(row.id) ?? []),
    );
  }

  /** Base query for rows visible to {@link userId}. */
  private transactionScopeQueryBuilder(userId: string) {
    return this.repository
      .createQueryBuilder('t')
      .leftJoin('t.account', 'a')
      .leftJoin('t.creditCard', 'cc')
      .leftJoin('cc.account', 'acca')
      .where(
        '((t.account_id IS NOT NULL AND a.user_id = :scopeUserId) OR (t.credit_card_id IS NOT NULL AND acca.user_id = :scopeUserId))',
        { scopeUserId: userId },
      );
  }

  public async findOwnedByUser(
    data: TransactionFindOwnedByUserData,
  ): Promise<Transaction | undefined> {
    const row: TransactionRecordTypeOrmEntity | null = await this.transactionScopeQueryBuilder(
      data.userId,
    )
      .andWhere('t.id = :transactionId', { transactionId: data.transactionId })
      .getOne();
    if (row === null) {
      return undefined;
    }
    const categoryIds: string[] = await this.loadCategoryIdsForTransaction(
      row.id,
    );
    return TransactionMapper.fromPostgresToDomain(row, categoryIds);
  }

  public async update(data: TransactionUpdateData): Promise<Transaction> {
    const entity: TransactionRecordTypeOrmEntity | null = await this.transactionScopeQueryBuilder(
      data.ownerUserId,
    )
      .andWhere('t.id = :id', { id: data.id })
      .getOne();
    if (entity === null) {
      throw new Error('Transaction not found for update');
    }
    const categoryIds: string[] = this.normalizeCategoryIds(data.categoryIds);
    entity.amount = data.amount.toPersistenceString();
    entity.description = data.description;
    entity.recordDate = data.recordDate;
    entity.excludeFromStats = data.excludeFromStats;
    entity.transactionType = {
      id: data.transactionTypeId,
    } as TransactionTypeTypeOrmEntity;
    entity.currency = { id: data.currencyId } as CurrencyTypeOrmEntity;
    entity.account =
      data.accountId !== undefined
        ? ({ id: data.accountId } as AccountTypeOrmEntity)
        : null;
    entity.creditCard =
      data.creditCardId !== undefined
        ? ({
            id: data.creditCardId,
          } as CreditCardTypeOrmEntity)
        : null;
    const saved: TransactionRecordTypeOrmEntity =
      await this.repository.save(entity);
    await this.replaceCategoryLinks(saved.id, categoryIds);
    return TransactionMapper.fromPostgresToDomain(saved, categoryIds);
  }

  public async countByAccountId(
    data: TransactionCountByAccountData,
  ): Promise<number> {
    const qb = this.repository
      .createQueryBuilder('t')
      .leftJoin('t.creditCard', 'cc')
      .where(
        `(t.account_id = :acctId OR (t.credit_card_id IS NOT NULL AND cc.account_id = :acctId))`,
        { acctId: data.accountId },
      );
    return qb.getCount();
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
