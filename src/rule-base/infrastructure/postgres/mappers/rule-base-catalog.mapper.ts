import { RuleBaseCatalog } from '@rule-base/domain/entities/rule-base-catalog';
import { RuleBaseCatalogTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-base-catalog.typeorm-entity';

export class RuleBaseCatalogMapper {
  public static fromPostgresToDomain(
    entity: RuleBaseCatalogTypeOrmEntity,
  ): RuleBaseCatalog {
    return new RuleBaseCatalog(
      entity.id,
      entity.name,
      entity.key,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
