import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

@Entity({ name: 'transaction_types' })
export class TransactionTypeTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    type: 'varchar',
    length: TextFieldLimits.transactionTypeKey,
    unique: true,
  })
  public key!: string;

  @Column({
    type: 'varchar',
    length: TextFieldLimits.shortLabel,
    name: 'display_name_es',
  })
  public displayNameEs!: string;
}
