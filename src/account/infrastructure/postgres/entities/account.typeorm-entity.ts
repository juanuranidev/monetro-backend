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
import { CurrencyTypeOrmEntity } from '../../../../currency/infrastructure/postgres/entities/currency.typeorm-entity';
import { UserTypeOrmEntity } from '../../../../user/infrastructure/postgres/entities/user.typeorm-entity';

@Entity({ name: 'accounts' })
export class AccountTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255 })
  public name!: string;

  @Column({ type: 'varchar', length: 255 })
  public identifier!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
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
  b;

  @RelationId((account: AccountTypeOrmEntity) => account.user)
  public userId!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
