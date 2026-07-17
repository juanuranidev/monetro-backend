import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreditCardBrand } from '@credit-card/domain/entities/credit-card-brand';

import { CreditCardBrandCatalogMapper } from '@credit-card/infrastructure/postgres/mappers/credit-card-brand-catalog.mapper';

import type { CreditCardBrandFindByKeyData } from '@credit-card/domain/ports/types/credit-card-brand-find-by-key-data';

import { CreditCardBrandCatalogTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card-brand-catalog.typeorm-entity';

import type { ICreditCardBrandCatalogRepository } from '@credit-card/domain/ports/i-credit-card-brand-catalog-repository';

@Injectable()
export class CreditCardBrandCatalogTypeOrmRepository implements ICreditCardBrandCatalogRepository {
  public constructor(
    @InjectRepository(CreditCardBrandCatalogTypeOrmEntity)
    private readonly repository: Repository<CreditCardBrandCatalogTypeOrmEntity>,
  ) {}

  public async findAll(): Promise<readonly CreditCardBrand[]> {
    const rows: CreditCardBrandCatalogTypeOrmEntity[] =
      await this.repository.find({ order: { key: 'ASC' } });
    return rows.map((row: CreditCardBrandCatalogTypeOrmEntity) =>
      CreditCardBrandCatalogMapper.fromPostgresToDomain(row),
    );
  }

  public async findByKey(
    data: CreditCardBrandFindByKeyData,
  ): Promise<CreditCardBrand | undefined> {
    const normalized: string = data.key.trim().toLowerCase();
    const row: CreditCardBrandCatalogTypeOrmEntity | null =
      await this.repository.findOne({ where: { key: normalized } });
    return row === null
      ? undefined
      : CreditCardBrandCatalogMapper.fromPostgresToDomain(row);
  }
}
