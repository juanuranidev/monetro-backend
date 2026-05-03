import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RuleTypeCatalog } from '@rule-type/domain/entities/rule-type-catalog';
import { RuleTypeCatalogMapper } from '@rule-type/infrastructure/postgres/mappers/rule-type-catalog.mapper';
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

  public async findByKey(key: string): Promise<RuleTypeCatalog | undefined> {
    const normalizedKey: string = key.trim().toLowerCase();
    const row: RuleTypeCatalogTypeOrmEntity | null =
      await this.repository.findOne({
        where: { key: normalizedKey },
      });
    return row === null
      ? undefined
      : RuleTypeCatalogMapper.fromPostgresToDomain(row);
  }

  public async findById(id: string): Promise<RuleTypeCatalog | undefined> {
    const row: RuleTypeCatalogTypeOrmEntity | null =
      await this.repository.findOne({ where: { id } });
    return row === null
      ? undefined
      : RuleTypeCatalogMapper.fromPostgresToDomain(row);
  }
}
