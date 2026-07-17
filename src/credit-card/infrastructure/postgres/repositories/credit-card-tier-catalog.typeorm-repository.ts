import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreditCardTier } from '@credit-card/domain/entities/credit-card-tier';

import { CreditCardTierCatalogMapper } from '@credit-card/infrastructure/postgres/mappers/credit-card-tier-catalog.mapper';

import type { CreditCardTierFindByKeyData } from '@credit-card/domain/ports/types/credit-card-tier-find-by-key-data';

import { CreditCardTierCatalogTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card-tier-catalog.typeorm-entity';

import type { ICreditCardTierCatalogRepository } from '@credit-card/domain/ports/i-credit-card-tier-catalog-repository';

@Injectable()
export class CreditCardTierCatalogTypeOrmRepository implements ICreditCardTierCatalogRepository {
  public constructor(
    @InjectRepository(CreditCardTierCatalogTypeOrmEntity)
    private readonly repository: Repository<CreditCardTierCatalogTypeOrmEntity>,
  ) {}

  public async findAll(): Promise<readonly CreditCardTier[]> {
    const rows: CreditCardTierCatalogTypeOrmEntity[] =
      await this.repository.find({ order: { key: 'ASC' } });
    return rows.map((row: CreditCardTierCatalogTypeOrmEntity) =>
      CreditCardTierCatalogMapper.fromPostgresToDomain(row),
    );
  }

  public async findByKey(
    data: CreditCardTierFindByKeyData,
  ): Promise<CreditCardTier | undefined> {
    const normalized: string = data.key.trim().toLowerCase();
    const row: CreditCardTierCatalogTypeOrmEntity | null =
      await this.repository.findOne({ where: { key: normalized } });
    return row === null
      ? undefined
      : CreditCardTierCatalogMapper.fromPostgresToDomain(row);
  }
}
