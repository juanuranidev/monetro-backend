import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import { Rule } from '@rule/domain/entities/rule';
import { RuleMapper } from '@rule/infrastructure/postgres/mappers/rule.mapper';
import type { RuleCreateData } from '@rule/domain/ports/types/rule-create-data';
import type { RuleUpdateData } from '@rule/domain/ports/types/rule-update-data';
import type { IRuleRepository } from '@rule/domain/ports/i-rule-repository';
import { RuleRecordTypeOrmEntity } from '@rule/infrastructure/postgres/entities/rule-record.typeorm-entity';
import type { RuleDeleteOwnedData } from '@rule/domain/ports/types/rule-delete-owned-data';
import type { RuleFindAllByUserIdData } from '@rule/domain/ports/types/rule-find-all-by-user-id-data';
import type { RuleFindOwnedByUserData } from '@rule/domain/ports/types/rule-find-owned-by-user-data';
import { RuleCategorizationTargetTypeOrmEntity } from '@rule/infrastructure/postgres/entities/rule-categorization-target.typeorm-entity';

@Injectable()
export class RuleRecordTypeOrmRepository implements IRuleRepository {
  public constructor(
    @InjectRepository(RuleRecordTypeOrmEntity)
    private readonly repository: Repository<RuleRecordTypeOrmEntity>,
    @InjectRepository(RuleCategorizationTargetTypeOrmEntity)
    private readonly effectRepository: Repository<RuleCategorizationTargetTypeOrmEntity>,
  ) {}

  public async create(data: RuleCreateData): Promise<Rule> {
    const effectIds: string[] = this.normalizeEffectCategoryIds(
      data.effectCategoryIds,
    );
    const entity: RuleRecordTypeOrmEntity = this.repository.create();
    RuleMapper.assignDomainToEntity(entity, data);
    const saved: RuleRecordTypeOrmEntity = await this.repository.save(entity);
    await this.replaceEffectCategories(saved.id, effectIds);
    return RuleMapper.fromPostgresToDomain(saved, effectIds);
  }

  public async findAllByUserId(
    data: RuleFindAllByUserIdData,
  ): Promise<readonly Rule[]> {
    const rows: RuleRecordTypeOrmEntity[] = await this.repository.find({
      where: { user: { id: data.userId } },
      order: { createdAt: 'DESC' },
    });
    if (rows.length === 0) {
      return [];
    }
    const idMap: Map<string, string[]> =
      await this.loadEffectCategoryIdsByRuleIds(rows.map((r) => r.id));
    return rows.map((row) =>
      RuleMapper.fromPostgresToDomain(row, idMap.get(row.id) ?? []),
    );
  }

  public async findOwnedByUser(
    data: RuleFindOwnedByUserData,
  ): Promise<Rule | undefined> {
    const row: RuleRecordTypeOrmEntity | null = await this.repository.findOne({
      where: { id: data.ruleId, user: { id: data.userId } },
    });
    if (row === null) {
      return undefined;
    }
    const effectIds: string[] = await this.loadEffectCategoryIdsForRule(row.id);
    return RuleMapper.fromPostgresToDomain(row, effectIds);
  }

  public async update(data: RuleUpdateData): Promise<Rule> {
    const effectIds: string[] = this.normalizeEffectCategoryIds(
      data.effectCategoryIds,
    );
    const entity: RuleRecordTypeOrmEntity = await this.repository.findOneOrFail(
      {
        where: { id: data.id, user: { id: data.userId } },
      },
    );
    RuleMapper.assignDomainToEntity(entity, data);
    const saved: RuleRecordTypeOrmEntity = await this.repository.save(entity);
    await this.replaceEffectCategories(saved.id, effectIds);
    return RuleMapper.fromPostgresToDomain(saved, effectIds);
  }

  public async deleteOwned(data: RuleDeleteOwnedData): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(RuleRecordTypeOrmEntity)
      .where('id = :ruleId', { ruleId: data.ruleId })
      .andWhere('user_id = :userId', { userId: data.userId })
      .execute();
  }

  private normalizeEffectCategoryIds(
    effectCategoryIds: readonly string[],
  ): string[] {
    return [...new Set(effectCategoryIds)].sort();
  }

  private async loadEffectCategoryIdsForRule(
    ruleId: string,
  ): Promise<string[]> {
    const rows: RuleCategorizationTargetTypeOrmEntity[] =
      await this.effectRepository.find({
        where: { ruleId },
        order: { categoryId: 'ASC' },
      });
    return rows.map((r) => r.categoryId);
  }

  private async loadEffectCategoryIdsByRuleIds(
    ruleIds: string[],
  ): Promise<Map<string, string[]>> {
    const result: Map<string, string[]> = new Map();
    for (const id of ruleIds) {
      result.set(id, []);
    }
    if (ruleIds.length === 0) {
      return result;
    }
    const rows: RuleCategorizationTargetTypeOrmEntity[] =
      await this.effectRepository.find({
        where: { ruleId: In(ruleIds) },
        order: { categoryId: 'ASC' },
      });
    for (const r of rows) {
      const list: string[] = result.get(r.ruleId) ?? [];
      list.push(r.categoryId);
      result.set(r.ruleId, list);
    }
    for (const id of ruleIds) {
      const list: string[] = result.get(id) ?? [];
      list.sort();
      result.set(id, list);
    }
    return result;
  }

  private async replaceEffectCategories(
    ruleId: string,
    categoryIds: string[],
  ): Promise<void> {
    await this.effectRepository.delete({ ruleId });
    if (categoryIds.length === 0) {
      return;
    }
    const toSave: RuleCategorizationTargetTypeOrmEntity[] = categoryIds.map(
      (categoryId) => this.effectRepository.create({ ruleId, categoryId }),
    );
    await this.effectRepository.save(toSave);
  }
}
