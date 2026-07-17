import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

@Entity({ name: 'credit_card_brands' })
export class CreditCardBrandCatalogTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    type: 'varchar',
    length: TextFieldLimits.creditCardCatalogKey,
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
