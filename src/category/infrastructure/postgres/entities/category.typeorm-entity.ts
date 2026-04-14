import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserTypeOrmEntity } from '@user/infrastructure/postgres/entities/user.typeorm-entity';

@Entity({ name: 'categories' })
export class CategoryTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255 })
  public name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public icon!: string | null;

  @Column({ type: 'boolean', default: false, name: 'is_default' })
  public isDefault!: boolean;

  @ManyToOne(() => UserTypeOrmEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: UserTypeOrmEntity | null;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  public userId!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
