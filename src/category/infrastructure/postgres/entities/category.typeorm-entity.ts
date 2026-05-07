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

import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';

import { UserTypeOrmEntity } from '@user/infrastructure/postgres/entities/user.typeorm-entity';

@Entity({ name: 'categories' })
export class CategoryTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: TextFieldLimits.shortLabel })
  public name!: string;

  @Column({ type: 'varchar', length: TextFieldLimits.shortLabel })
  public icon!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  public isActive!: boolean;

  @ManyToOne(() => UserTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: UserTypeOrmEntity;

  @RelationId((category: CategoryTypeOrmEntity) => category.user)
  public userId!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
