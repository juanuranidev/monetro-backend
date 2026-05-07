import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

@Entity({ name: 'currencies' })
export class CurrencyTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    type: 'varchar',
    length: TextFieldLimits.currencyKey,
    unique: true,
  })
  public key!: string;

  @Column({ type: 'varchar', length: TextFieldLimits.currencySymbol })
  public symbol!: string;

  @Column({ type: 'varchar', length: TextFieldLimits.currencyName })
  public name!: string;
}
