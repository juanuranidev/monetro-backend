import { User } from '../../../domain/entities/user';
import { UserTypeOrmEntity } from '../entities/user.typeorm-entity';

/**
 * Maps between domain User and Postgres-backed persistence (TypeORM).
 */
export class UserMapper {
  /**
   * Maps a Postgres-backed user row (TypeORM entity) to the domain model.
   */
  public static fromPostgresToDomain(entity: UserTypeOrmEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.authId ?? undefined,
      entity.image ?? undefined,
    );
  }

  /**
   * Maps a domain user to fields for a Postgres row (TypeORM insert/update).
   */
  public static fromDomainToPostgresRow(domain: User): Partial<UserTypeOrmEntity> {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
      password: domain.passwordHash ?? '',
      authId: domain.authId ?? null,
      image: domain.image ?? null,
    };
  }
}
