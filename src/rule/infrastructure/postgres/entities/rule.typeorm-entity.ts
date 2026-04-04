import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { AccountTypeOrmEntity } from '../../../../account/infrastructure/postgres/entities/account.typeorm-entity';
import { CategoryTypeOrmEntity } from '../../../../category/infrastructure/postgres/entities/category.typeorm-entity';
import { UserTypeOrmEntity } from '../../../../user/infrastructure/postgres/entities/user.typeorm-entity';

@Entity({ name: 'rules' })
export class RuleTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 512 })
  public pattern!: string;

  @ManyToOne(() => CategoryTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_category_id' })
  public targetCategory!: CategoryTypeOrmEntity;

  @RelationId((rule: RuleTypeOrmEntity) => rule.targetCategory)
  public targetCategoryId!: string;

  @ManyToOne(() => AccountTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_account_id' })
  public targetAccount!: AccountTypeOrmEntity;

  @RelationId((rule: RuleTypeOrmEntity) => rule.targetAccount)
  public targetAccountId!: string;

  @ManyToOne(() => UserTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: UserTypeOrmEntity;

  @RelationId((rule: RuleTypeOrmEntity) => rule.user)
  public userId!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
