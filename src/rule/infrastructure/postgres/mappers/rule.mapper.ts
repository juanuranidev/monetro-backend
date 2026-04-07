import { Rule } from '../../../domain/entities/rule';
import { RuleTypeOrmEntity } from '../entities/rule.typeorm-entity';

export class RuleMapper {
  /**
   * Maps a Postgres-backed rule row (TypeORM entity) to the domain model.
   */
  public static fromPostgresToDomain(entity: RuleTypeOrmEntity): Rule {
    return new Rule(
      entity.id,
      entity.pattern,
      entity.targetCategoryId,
      entity.targetAccountId,
      entity.userId,
    );
  }
}
