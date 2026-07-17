import { CreditCardTierCatalogTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card-tier-catalog.typeorm-entity';

import { CreditCardBrandCatalogTypeOrmEntity } from '@credit-card/infrastructure/postgres/entities/credit-card-brand-catalog.typeorm-entity';

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

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

@Entity({ name: 'credit_cards' })
export class CreditCardTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(() => AccountTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  public account!: AccountTypeOrmEntity;

  @RelationId((c: CreditCardTypeOrmEntity) => c.account)
  public accountId!: string;

  @ManyToOne(() => CreditCardBrandCatalogTypeOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'brand_id' })
  public brand!: CreditCardBrandCatalogTypeOrmEntity;

  @RelationId((c: CreditCardTypeOrmEntity) => c.brand)
  public brandId!: string;

  @ManyToOne(() => CreditCardTierCatalogTypeOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tier_id' })
  public tier!: CreditCardTierCatalogTypeOrmEntity;

  @RelationId((c: CreditCardTypeOrmEntity) => c.tier)
  public tierId!: string;

  @Column({
    type: 'varchar',
    length: TextFieldLimits.creditCardLastSixDigits,
    name: 'last_six_digits',
  })
  public lastSixDigits!: string;

  @Column({ type: 'smallint', name: 'expiry_month' })
  public expiryMonth!: number;

  @Column({ type: 'smallint', name: 'expiry_year' })
  public expiryYear!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  public creditLimit!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
