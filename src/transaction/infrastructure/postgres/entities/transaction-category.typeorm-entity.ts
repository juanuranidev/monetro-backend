import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';

import { TransactionRecordTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction.typeorm-entity';

/** Many-to-many link: one transaction, many categories (all equivalent). */
@Entity({ name: 'transaction_categories' })
export class TransactionCategoryTypeOrmEntity {
  @PrimaryColumn('uuid', { name: 'transaction_id' })
  public transactionId!: string;

  @PrimaryColumn('uuid', { name: 'category_id' })
  public categoryId!: string;

  @ManyToOne(() => TransactionRecordTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id' })
  public transaction!: TransactionRecordTypeOrmEntity;

  @ManyToOne(() => CategoryTypeOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  public category!: CategoryTypeOrmEntity;
}
