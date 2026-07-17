import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RuleTypeCatalog } from '@rule-type/domain/entities/rule-type-catalog';

import { RuleTypeCatalogMapper } from '@rule-type/infrastructure/postgres/mappers/rule-type-catalog.mapper';

import type { RuleTypeFindByIdData } from '@rule-type/domain/ports/types/rule-type-find-by-id-data';

import type { RuleTypeFindByKeyData } from '@rule-type/domain/ports/types/rule-type-find-by-key-data';

import { RuleTypeCatalogTypeOrmEntity } from '@rule-type/infrastructure/postgres/entities/rule-type-catalog.typeorm-entity';

import type { IRuleTypeCatalogRepository } from '@rule-type/domain/ports/i-rule-type-catalog-repository';

@Injectable()
export class RuleTypeCatalogTypeOrmRepository implements IRuleTypeCatalogRepository {
  public constructor(
    @InjectRepository(RuleTypeCatalogTypeOrmEntity)
    private readonly repository: Repository<RuleTypeCatalogTypeOrmEntity>,
  ) {}

  public async findAll(): Promise<readonly RuleTypeCatalog[]> {
    const rows: RuleTypeCatalogTypeOrmEntity[] = await this.repository.find({
      order: { name: 'ASC' },
    });
    return rows.map((row) => RuleTypeCatalogMapper.fromPostgresToDomain(row));
  }

  public async findByKey(
    data: RuleTypeFindByKeyData,
  ): Promise<RuleTypeCatalog | undefined> {
    const normalizedKey: string = data.key.trim().toLowerCase();
    const row: RuleTypeCatalogTypeOrmEntity | null =
      await this.repository.findOne({
        where: { key: normalizedKey },
      });
    return row === null
      ? undefined
      : RuleTypeCatalogMapper.fromPostgresToDomain(row);
  }

  public async findById(
    data: RuleTypeFindByIdData,
  ): Promise<RuleTypeCatalog | undefined> {
    const row: RuleTypeCatalogTypeOrmEntity | null =
      await this.repository.findOne({ where: { id: data.id } });
    return row === null
      ? undefined
      : RuleTypeCatalogMapper.fromPostgresToDomain(row);
  }
}
