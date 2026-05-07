import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

@Entity({ name: 'rule_types' })
export class RuleTypeCatalogTypeOrmEntity {
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

  @Column({ type: 'text', nullable: true })
  public description!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
