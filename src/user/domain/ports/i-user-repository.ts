import type { User, UserCreateData } from '@user/domain/entities/user';

export interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: UserCreateData): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
}
