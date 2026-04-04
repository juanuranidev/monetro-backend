import { Rule } from '../../../domain/entities/rule';
import { RuleTypeOrmEntity } from '../entities/rule.typeorm-entity';

export class RuleMapper {
  public static toDomain(entity: RuleTypeOrmEntity): Rule {
    return new Rule(
      entity.id,
      entity.pattern,
      entity.targetCategoryId,
      entity.targetAccountId,
      entity.userId,
    );
  }
}
