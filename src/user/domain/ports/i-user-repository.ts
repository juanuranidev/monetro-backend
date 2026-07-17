import type { User } from '@user/domain/entities/user';
import type { UserCreateData } from '@user/domain/ports/types/user-create-data';
import type { UserFindByIdData } from '@user/domain/ports/types/user-find-by-id-data';
import type { UserFindByEmailData } from '@user/domain/ports/types/user-find-by-email-data';

export interface IUserRepository {
  findById(data: UserFindByIdData): Promise<User | undefined>;
  findByEmail(data: UserFindByEmailData): Promise<User | undefined>;
  create(data: UserCreateData): Promise<User>;
  existsByEmail(data: UserFindByEmailData): Promise<boolean>;
}
