import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from '../../../domain/entities/rule';
import type { IRuleRepository } from '../../../domain/ports/i-rule-repository';
import { RuleMapper } from '../mappers/rule.mapper';
import { RuleTypeOrmEntity } from '../entities/rule.typeorm-entity';

@Injectable()
export class RuleTypeOrmRepository implements IRuleRepository {
  public constructor(
    @InjectRepository(RuleTypeOrmEntity)
    private readonly repository: Repository<RuleTypeOrmEntity>,
  ) {}

  public async create(domain: Rule): Promise<Rule> {
    const entity: RuleTypeOrmEntity = this.repository.create({
      id: domain.id,
      pattern: domain.pattern,
      targetCategoryId: domain.targetCategoryId,
      targetAccountId: domain.targetAccountId,
      userId: domain.userId,
    });
    const saved: RuleTypeOrmEntity = await this.repository.save(entity);
    return RuleMapper.fromPostgresToDomain(saved);
  }
}
