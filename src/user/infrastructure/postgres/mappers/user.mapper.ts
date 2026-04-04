import { User } from '../../../domain/entities/user';
import { UserTypeOrmEntity } from '../entities/user.typeorm-entity';

/**
 * Maps between domain User and TypeORM user row.
 */
export class UserMapper {
  public static toDomain(entity: UserTypeOrmEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.authId ?? undefined,
      entity.image ?? undefined,
    );
  }

  public static toPersistence(domain: User): Partial<UserTypeOrmEntity> {
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
