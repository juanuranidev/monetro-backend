import { Injectable } from '@nestjs/common';
import { Account } from '../../../domain/entities/account';
import type { IAccountRepository } from '../../../domain/ports/interface-account-repository';
import { AccountMongoMemoryStore } from '../account-mongo-memory.store';

/**
 * Simulated MongoDB adapter: same port as TypeORM, swap via AccountMongoModule.
 * A real implementation would use @InjectModel(AccountMongoSchema.name) from Mongoose.
 */
@Injectable()
export class AccountMongoSimulatedRepository implements IAccountRepository {
  public constructor(private readonly store: AccountMongoMemoryStore) {}

  public async create(account: Account): Promise<Account> {
    this.store.save(account);
    return account;
  }

  public async findOwnedByUser(
    accountId: string,
    userId: string,
  ): Promise<Account | undefined> {
    const found: Account | undefined = this.store.findById(accountId);
    if (found === undefined || found.userId !== userId) {
      return undefined;
    }
    return found;
  }
}
