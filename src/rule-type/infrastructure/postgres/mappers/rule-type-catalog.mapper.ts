import { RuleTypeCatalog } from '@rule-type/domain/entities/rule-type-catalog';
import { RuleTypeCatalogTypeOrmEntity } from '@rule-type/infrastructure/postgres/entities/rule-type-catalog.typeorm-entity';

export class RuleTypeCatalogMapper {
  public static fromPostgresToDomain(
    entity: RuleTypeCatalogTypeOrmEntity,
  ): RuleTypeCatalog {
    return new RuleTypeCatalog(
      entity.id,
      entity.name,
      entity.key,
      entity.description === null ? undefined : entity.description,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
