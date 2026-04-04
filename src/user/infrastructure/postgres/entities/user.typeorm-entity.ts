import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255 })
  public name!: string;

  @Column({ type: 'varchar', length: 320, unique: true })
  public email!: string;

  @Column({ type: 'varchar', length: 255 })
  public password!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'auth_id' })
  public authId!: string | null;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  public image!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
