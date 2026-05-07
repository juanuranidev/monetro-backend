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

import { CurrencyTypeOrmEntity } from '@currency/infrastructure/postgres/entities/currency.typeorm-entity';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

import { TransactionTypeTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-type.typeorm-entity';

@Entity({ name: 'transactions' })
export class TransactionRecordTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public amount!: string;

  @Column({ type: 'varchar', length: TextFieldLimits.transactionDescription })
  public description!: string;

  @Column({ type: 'timestamptz', name: 'record_date' })
  public recordDate!: Date;

  @Column({ type: 'boolean', default: false, name: 'exclude_from_stats' })
  public excludeFromStats!: boolean;

  @ManyToOne(() => TransactionTypeTypeOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'transaction_type_id' })
  public transactionType!: TransactionTypeTypeOrmEntity;

  @RelationId((t: TransactionRecordTypeOrmEntity) => t.transactionType)
  public transactionTypeId!: string;

  @ManyToOne(() => CurrencyTypeOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'currency_id' })
  public currency!: CurrencyTypeOrmEntity;

  @RelationId((t: TransactionRecordTypeOrmEntity) => t.currency)
  public currencyId!: string;

  @ManyToOne(() => AccountTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  public account!: AccountTypeOrmEntity;

  @RelationId((t: TransactionRecordTypeOrmEntity) => t.account)
  public accountId!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
