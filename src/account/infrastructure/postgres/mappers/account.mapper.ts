import { Account } from '../../../domain/entities/account';
import { AccountTypeOrmEntity } from '../entities/account.typeorm-entity';

export class AccountMapper {
  public static toDomain(entity: AccountTypeOrmEntity): Account {
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
