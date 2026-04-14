import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@user/domain/entities/user';
import type { IUserRepository } from '@user/domain/ports/i-user-repository';
import { UserMapper } from '@user/infrastructure/postgres/mappers/user.mapper';
import { UserTypeOrmEntity } from '@user/infrastructure/postgres/entities/user.typeorm-entity';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  public constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>,
  ) {}

  public async findById(id: string): Promise<User | undefined> {
    const row: UserTypeOrmEntity | null = await this.repository.findOne({
      where: { id },
    });
    return row === null ? undefined : UserMapper.fromPostgresToDomain(row);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const row: UserTypeOrmEntity | null = await this.repository.findOne({
      where: { email: email.toLowerCase() },
    });
    return row === null ? undefined : UserMapper.fromPostgresToDomain(row);
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const count: number = await this.repository.count({
      where: { email: email.toLowerCase() },
    });
    return count > 0;
  }

  public async create(user: User): Promise<User> {
    const entity: UserTypeOrmEntity = this.repository.create(
      UserMapper.fromDomainToPostgresRow(user),
    );
    const saved: UserTypeOrmEntity = await this.repository.save(entity);
    return UserMapper.fromPostgresToDomain(saved);
  }
}
