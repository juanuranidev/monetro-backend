import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transaction_types' })
export class TransactionTypeTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  public code!: string;
}
