import { RuleBaseCatalogTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-base-catalog.typeorm-entity';

import { RuleTypeCatalogTypeOrmEntity } from '@rule-type/infrastructure/postgres/entities/rule-type-catalog.typeorm-entity';

import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  RelationId,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AccountTypeOrmEntity } from '@account/infrastructure/postgres/entities/account.typeorm-entity';

import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

import { TransactionTypeTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-type.typeorm-entity';

import { UserTypeOrmEntity } from '@user/infrastructure/postgres/entities/user.typeorm-entity';

@Entity({ name: 'rules' })
export class RuleRecordTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: TextFieldLimits.shortLabel })
  public name!: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  public isActive!: boolean;

  @ManyToOne(() => RuleTypeCatalogTypeOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'rule_type_id' })
  public ruleType!: RuleTypeCatalogTypeOrmEntity;

  @RelationId((rule: RuleRecordTypeOrmEntity) => rule.ruleType)
  public ruleTypeId!: string;

  @ManyToOne(() => RuleBaseCatalogTypeOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'rule_base_id' })
  public ruleBase!: RuleBaseCatalogTypeOrmEntity;

  @RelationId((rule: RuleRecordTypeOrmEntity) => rule.ruleBase)
  public ruleBaseId!: string;

  @Column({
    type: 'varchar',
    length: TextFieldLimits.rulePattern,
    default: '',
  })
  public pattern!: string;

  @ManyToOne(() => AccountTypeOrmEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'source_account_id' })
  public sourceAccount!: AccountTypeOrmEntity | null;

  @RelationId((rule: RuleRecordTypeOrmEntity) => rule.sourceAccount)
  public sourceAccountId!: string | null;

  @ManyToOne(() => CategoryTypeOrmEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'source_category_id' })
  public sourceCategory!: CategoryTypeOrmEntity | null;

  @RelationId((rule: RuleRecordTypeOrmEntity) => rule.sourceCategory)
  public sourceCategoryId!: string | null;

  @ManyToOne(() => TransactionTypeTypeOrmEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'source_transaction_type_id' })
  public sourceTransactionType!: TransactionTypeTypeOrmEntity | null;

  @RelationId((rule: RuleRecordTypeOrmEntity) => rule.sourceTransactionType)
  public sourceTransactionTypeId!: string | null;

  @Column({
    type: 'boolean',
    default: false,
    name: 'excludes_from_stats',
  })
  public excludesFromStats!: boolean;

  @ManyToOne(() => UserTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: UserTypeOrmEntity;

  @RelationId((rule: RuleRecordTypeOrmEntity) => rule.user)
  public userId!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
