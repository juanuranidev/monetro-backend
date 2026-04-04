import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTypeOrmEntity } from '../../../../account/infrastructure/postgres/entities/account.typeorm-entity';
import { CategoryTypeOrmEntity } from '../../../../category/infrastructure/postgres/entities/category.typeorm-entity';
import { UserTypeOrmEntity } from '../../../../user/infrastructure/postgres/entities/user.typeorm-entity';
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
      targetCategory: { id: domain.targetCategoryId } as CategoryTypeOrmEntity,
      targetAccount: { id: domain.targetAccountId } as AccountTypeOrmEntity,
      user: { id: domain.userId } as UserTypeOrmEntity,
    });
    const saved: RuleTypeOrmEntity = await this.repository.save(entity);
    return RuleMapper.toDomain(saved);
  }
}
