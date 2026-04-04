import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'currencies' })
export class CurrencyTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 3, unique: true })
  public code!: string;

  @Column({ type: 'varchar', length: 8 })
  public symbol!: string;

  @Column({ type: 'varchar', length: 128 })
  public name!: string;
}
