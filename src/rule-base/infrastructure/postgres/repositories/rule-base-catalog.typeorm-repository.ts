import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RuleBaseCatalog } from '@rule-base/domain/entities/rule-base-catalog';

import { RuleBaseCatalogMapper } from '@rule-base/infrastructure/postgres/mappers/rule-base-catalog.mapper';

import { RuleBaseCatalogTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-base-catalog.typeorm-entity';

import { RuleTypeBasePivotTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-type-base-pivot.typeorm-entity';

import type { IRuleBaseCatalogRepository } from '@rule-base/domain/ports/i-rule-base-catalog-repository';

@Injectable()
export class RuleBaseCatalogTypeOrmRepository implements IRuleBaseCatalogRepository {
  public constructor(
    @InjectRepository(RuleBaseCatalogTypeOrmEntity)
    private readonly baseRepository: Repository<RuleBaseCatalogTypeOrmEntity>,
    @InjectRepository(RuleTypeBasePivotTypeOrmEntity)
    private readonly pivotRepository: Repository<RuleTypeBasePivotTypeOrmEntity>,
  ) {}

  public async findAll(): Promise<readonly RuleBaseCatalog[]> {
    const rows: RuleBaseCatalogTypeOrmEntity[] = await this.baseRepository.find(
      { order: { name: 'ASC' } },
    );
    return rows.map((row) => RuleBaseCatalogMapper.fromPostgresToDomain(row));
  }

  public async findByKey(key: string): Promise<RuleBaseCatalog | undefined> {
    const normalizedKey: string = key.trim().toLowerCase();
    const row: RuleBaseCatalogTypeOrmEntity | null =
      await this.baseRepository.findOne({
        where: { key: normalizedKey },
      });
    return row === null
      ? undefined
      : RuleBaseCatalogMapper.fromPostgresToDomain(row);
  }

  public async findById(id: string): Promise<RuleBaseCatalog | undefined> {
    const row: RuleBaseCatalogTypeOrmEntity | null =
      await this.baseRepository.findOne({ where: { id } });
    return row === null
      ? undefined
      : RuleBaseCatalogMapper.fromPostgresToDomain(row);
  }

  public async findAllByRuleTypeKey(
    ruleTypeKey: string,
  ): Promise<readonly RuleBaseCatalog[]> {
    const normalizedKey: string = ruleTypeKey.trim().toLowerCase();
    const rows: RuleBaseCatalogTypeOrmEntity[] = await this.baseRepository
      .createQueryBuilder('base')
      .innerJoin('rule_type_bases', 'rtb', 'rtb.rule_base_id = base.id')
      .innerJoin('rule_types', 'rt', 'rt.id = rtb.rule_type_id')
      .where('rt.key = :ruleTypeKey', { ruleTypeKey: normalizedKey })
      .orderBy('base.name', 'ASC')
      .getMany();
    return rows.map((row) => RuleBaseCatalogMapper.fromPostgresToDomain(row));
  }

  public async isPairAllowed(
    ruleTypeKey: string,
    ruleBaseKey: string,
  ): Promise<boolean> {
    const typeKey: string = ruleTypeKey.trim().toLowerCase();
    const baseKey: string = ruleBaseKey.trim().toLowerCase();
    const count: number = await this.pivotRepository
      .createQueryBuilder('pivot')
      .innerJoin('rule_types', 'rt', 'rt.id = pivot.rule_type_id')
      .innerJoin('rule_bases', 'rb', 'rb.id = pivot.rule_base_id')
      .where('rt.key = :typeKey', { typeKey })
      .andWhere('rb.key = :baseKey', { baseKey })
      .getCount();
    return count > 0;
  }
}
