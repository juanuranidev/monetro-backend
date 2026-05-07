import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

@Entity({ name: 'rule_bases' })
export class RuleBaseCatalogTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: TextFieldLimits.shortLabel })
  public name!: string;

  @Column({
    type: 'varchar',
    length: TextFieldLimits.ruleCatalogKey,
    unique: true,
  })
  public key!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
