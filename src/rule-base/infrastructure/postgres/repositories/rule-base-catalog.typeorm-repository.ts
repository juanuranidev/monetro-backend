import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RuleBaseCatalog } from '@rule-base/domain/entities/rule-base-catalog';

import { RuleBaseCatalogMapper } from '@rule-base/infrastructure/postgres/mappers/rule-base-catalog.mapper';

import type { RuleBaseFindByIdData } from '@rule-base/domain/ports/types/rule-base-find-by-id-data';

import type { RuleBaseFindByKeyData } from '@rule-base/domain/ports/types/rule-base-find-by-key-data';

import { RuleBaseCatalogTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-base-catalog.typeorm-entity';

import type { RuleBaseIsPairAllowedData } from '@rule-base/domain/ports/types/rule-base-is-pair-allowed-data';

import { RuleTypeBasePivotTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-type-base-pivot.typeorm-entity';

import type { IRuleBaseCatalogRepository } from '@rule-base/domain/ports/i-rule-base-catalog-repository';

import type { RuleBaseFindAllByRuleTypeKeyData } from '@rule-base/domain/ports/types/rule-base-find-all-by-rule-type-key-data';

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

  public async findByKey(
    data: RuleBaseFindByKeyData,
  ): Promise<RuleBaseCatalog | undefined> {
    const normalizedKey: string = data.key.trim().toLowerCase();
    const row: RuleBaseCatalogTypeOrmEntity | null =
      await this.baseRepository.findOne({
        where: { key: normalizedKey },
      });
    return row === null
      ? undefined
      : RuleBaseCatalogMapper.fromPostgresToDomain(row);
  }

  public async findById(
    data: RuleBaseFindByIdData,
  ): Promise<RuleBaseCatalog | undefined> {
    const row: RuleBaseCatalogTypeOrmEntity | null =
      await this.baseRepository.findOne({ where: { id: data.id } });
    return row === null
      ? undefined
      : RuleBaseCatalogMapper.fromPostgresToDomain(row);
  }

  public async findAllByRuleTypeKey(
    data: RuleBaseFindAllByRuleTypeKeyData,
  ): Promise<readonly RuleBaseCatalog[]> {
    const normalizedKey: string = data.ruleTypeKey.trim().toLowerCase();
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
    data: RuleBaseIsPairAllowedData,
  ): Promise<boolean> {
    const typeKey: string = data.ruleTypeKey.trim().toLowerCase();
    const baseKey: string = data.ruleBaseKey.trim().toLowerCase();
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
