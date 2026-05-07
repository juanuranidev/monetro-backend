import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

@Entity({ name: 'users' })
export class UserTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: TextFieldLimits.shortLabel })
  public name!: string;

  @Column({
    type: 'varchar',
    length: TextFieldLimits.email,
    unique: true,
  })
  public email!: string;

  @Column({ type: 'varchar', length: TextFieldLimits.shortLabel })
  public password!: string;

  @Column({
    type: 'varchar',
    length: TextFieldLimits.shortLabel,
    nullable: true,
    name: 'auth_id',
  })
  public authId!: string | null;

  @Column({
    type: 'varchar',
    length: TextFieldLimits.url,
    nullable: true,
  })
  public image!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
