import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';

import { RuleRecordTypeOrmEntity } from '@rule/infrastructure/postgres/entities/rule-record.typeorm-entity';

/** When a categorization rule matches, these category ids are applied to the transaction. */
@Entity({ name: 'rule_categorization_targets' })
export class RuleCategorizationTargetTypeOrmEntity {
  @PrimaryColumn('uuid', { name: 'rule_id' })
  public ruleId!: string;

  @PrimaryColumn('uuid', { name: 'category_id' })
  public categoryId!: string;

  @ManyToOne(() => RuleRecordTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rule_id' })
  public rule!: RuleRecordTypeOrmEntity;

  @ManyToOne(() => CategoryTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  public category!: CategoryTypeOrmEntity;
}
