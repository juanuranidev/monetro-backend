import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import type { User } from '@user/domain/entities/user';
import { UserMapper } from '@user/infrastructure/postgres/mappers/user.mapper';
import { UserTypeOrmEntity } from '@user/infrastructure/postgres/entities/user.typeorm-entity';
import type { UserCreateData } from '@user/domain/ports/types/user-create-data';
import type { IUserRepository } from '@user/domain/ports/i-user-repository';
import type { UserFindByIdData } from '@user/domain/ports/types/user-find-by-id-data';
import type { UserFindByEmailData } from '@user/domain/ports/types/user-find-by-email-data';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  public constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>,
  ) {}

  public async findById(data: UserFindByIdData): Promise<User | undefined> {
    const row: UserTypeOrmEntity | null = await this.repository.findOne({
      where: { id: data.id },
    });
    return row === null ? undefined : UserMapper.fromPostgresToDomain(row);
  }

  public async findByEmail(
    data: UserFindByEmailData,
  ): Promise<User | undefined> {
    const row: UserTypeOrmEntity | null = await this.repository.findOne({
      where: { email: data.email.toLowerCase() },
    });
    return row === null ? undefined : UserMapper.fromPostgresToDomain(row);
  }

  public async existsByEmail(data: UserFindByEmailData): Promise<boolean> {
    const count: number = await this.repository.count({
      where: { email: data.email.toLowerCase() },
    });
    return count > 0;
  }

  public async create(data: UserCreateData): Promise<User> {
    const entity: UserTypeOrmEntity = this.repository.create(
      UserMapper.fromCreateDataToPostgresRow(data),
    );
    const saved: UserTypeOrmEntity = await this.repository.save(entity);
    return UserMapper.fromPostgresToDomain(saved);
  }
}
