import { User } from '@user/domain/entities/user';
import { UserTypeOrmEntity } from '@user/infrastructure/postgres/entities/user.typeorm-entity';
import type { UserCreateData } from '@user/domain/ports/types/user-create-data';

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
      entity.image ?? undefined,
    );
  }

  /**
   * Insert without client-assigned `id` (DB generates the primary key).
   */
  public static fromCreateDataToPostgresRow(
    data: UserCreateData,
  ): Partial<UserTypeOrmEntity> {
    return {
      name: data.name,
      email: data.email,
      password: data.password ?? '',
      image: data.image ?? null,
    };
  }
}
