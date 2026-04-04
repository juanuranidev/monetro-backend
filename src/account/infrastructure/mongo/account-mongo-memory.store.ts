import { Injectable } from '@nestjs/common';
import type { Account } from '../../domain/entities/account';

/**
 * In-memory stand-in for a MongoDB collection (simulation only).
 */
@Injectable()
export class AccountMongoMemoryStore {
  private readonly accountsById = new Map<string, Account>();

  public save(account: Account): void {
    this.accountsById.set(account.id, account);
  }

  public findById(id: string): Account | undefined {
    return this.accountsById.get(id);
  }
}
