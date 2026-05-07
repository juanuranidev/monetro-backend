import { RuleBaseCatalogTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-base-catalog.typeorm-entity';

import { RuleTypeCatalogTypeOrmEntity } from '@rule-type/infrastructure/postgres/entities/rule-type-catalog.typeorm-entity';

import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'rule_type_bases' })
export class RuleTypeBasePivotTypeOrmEntity {
  @PrimaryColumn('uuid', { name: 'rule_type_id' })
  public ruleTypeId!: string;

  @PrimaryColumn('uuid', { name: 'rule_base_id' })
  public ruleBaseId!: string;

  @ManyToOne(() => RuleTypeCatalogTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rule_type_id' })
  public ruleType!: RuleTypeCatalogTypeOrmEntity;

  @ManyToOne(() => RuleBaseCatalogTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rule_base_id' })
  public ruleBase!: RuleBaseCatalogTypeOrmEntity;
}
