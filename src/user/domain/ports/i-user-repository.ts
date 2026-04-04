import type { User } from '../entities/user';

export interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(user: User): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
}
