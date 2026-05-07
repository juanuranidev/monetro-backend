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

import { CurrencyTypeOrmEntity } from '@currency/infrastructure/postgres/entities/currency.typeorm-entity';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

import { UserTypeOrmEntity } from '@user/infrastructure/postgres/entities/user.typeorm-entity';

@Entity({ name: 'accounts' })
export class AccountTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: TextFieldLimits.shortLabel })
  public name!: string;

  @Column({ type: 'varchar', length: TextFieldLimits.shortLabel })
  public identifier!: string;

  @Column({
    type: 'varchar',
    length: TextFieldLimits.shortLabel,
    nullable: true,
  })
  public icon!: string | null;

  @Column({ type: 'boolean', default: false, name: 'exclude_from_stats' })
  public excludeFromStats!: boolean;

  @ManyToOne(() => CurrencyTypeOrmEntity, {
    eager: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'currency_id' })
  public currency!: CurrencyTypeOrmEntity;

  @RelationId((account: AccountTypeOrmEntity) => account.currency)
  public currencyId!: string;

  @ManyToOne(() => UserTypeOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  public user!: UserTypeOrmEntity;

  @RelationId((account: AccountTypeOrmEntity) => account.user)
  public userId!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
