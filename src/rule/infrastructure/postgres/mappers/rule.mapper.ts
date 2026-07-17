import { RuleBaseCatalogTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-base-catalog.typeorm-entity';

import { RuleTypeCatalogTypeOrmEntity } from '@rule-type/infrastructure/postgres/entities/rule-type-catalog.typeorm-entity';

import { AccountTypeOrmEntity } from '@account/infrastructure/postgres/entities/account.typeorm-entity';

import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';

import { Rule } from '@rule/domain/entities/rule';
import type { RuleCreateData } from '@rule/domain/ports/types/rule-create-data';
import { RuleRecordTypeOrmEntity } from '@rule/infrastructure/postgres/entities/rule-record.typeorm-entity';

import { TransactionTypeTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-type.typeorm-entity';

import { UserTypeOrmEntity } from '@user/infrastructure/postgres/entities/user.typeorm-entity';

export class RuleMapper {
  public static fromPostgresToDomain(
    entity: RuleRecordTypeOrmEntity,
    effectCategoryIds: readonly string[],
  ): Rule {
    return new Rule(
      entity.id,
      entity.name,
      entity.isActive,
      entity.ruleTypeId,
      entity.ruleBaseId,
      entity.pattern,
      entity.sourceAccountId === null ? undefined : entity.sourceAccountId,
      entity.sourceCategoryId === null ? undefined : entity.sourceCategoryId,
      entity.sourceTransactionTypeId === null
        ? undefined
        : entity.sourceTransactionTypeId,
      effectCategoryIds,
      entity.excludesFromStats,
      entity.userId,
    );
  }

  public static assignDomainToEntity(
    entity: RuleRecordTypeOrmEntity,
    data: RuleCreateData,
  ): void {
    entity.name = data.name;
    entity.isActive = data.isActive;
    entity.pattern = data.pattern;
    entity.excludesFromStats = data.excludesFromStats;
    entity.ruleType = { id: data.ruleTypeId } as RuleTypeCatalogTypeOrmEntity;
    entity.ruleBase = { id: data.ruleBaseId } as RuleBaseCatalogTypeOrmEntity;
    entity.user = { id: data.userId } as UserTypeOrmEntity;
    entity.sourceAccount =
      data.sourceAccountId === undefined
        ? null
        : ({ id: data.sourceAccountId } as AccountTypeOrmEntity);
    entity.sourceCategory =
      data.sourceCategoryId === undefined
        ? null
        : ({ id: data.sourceCategoryId } as CategoryTypeOrmEntity);
    entity.sourceTransactionType =
      data.sourceTransactionTypeId === undefined
        ? null
        : ({
            id: data.sourceTransactionTypeId,
          } as TransactionTypeTypeOrmEntity);
  }
}
