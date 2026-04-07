import { Account } from '../../../domain/entities/account';
import { AccountTypeOrmEntity } from '../entities/account.typeorm-entity';

export class AccountMapper {
  /**
   * Maps a Postgres-backed account row (TypeORM entity) to the domain model.
   */
  public static fromPostgresToDomain(entity: AccountTypeOrmEntity): Account {
    return new Account(
      entity.id,
      entity.name,
      entity.identifier,
      entity.icon ?? undefined,
      entity.excludeFromStats,
      entity.currencyId,
      entity.userId,
    );
  }
}
