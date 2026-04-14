import { Logger, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { IsNull, DataSource } from 'typeorm';

import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';

import { CurrencyTypeOrmEntity } from '@currency/infrastructure/postgres/entities/currency.typeorm-entity';

import { TransactionTypeTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-type.typeorm-entity';

const DEFAULT_CURRENCIES: readonly {
  readonly code: string;
  readonly symbol: string;
  readonly name: string;
}[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: 'â‚¬', name: 'Euro' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
] as const;

const DEFAULT_TXN_TYPES: readonly string[] = ['INCOME', 'EXPENSE'] as const;

const DEFAULT_CATEGORIES: readonly {
  readonly name: string;
  readonly icon: string;
}[] = [
  { name: 'Groceries', icon: 'cart' },
  { name: 'Salary', icon: 'briefcase' },
  { name: 'Transfers', icon: 'swap' },
] as const;

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeedService.name);

  public constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.seedCurrencies();
    await this.seedTransactionTypes();
    await this.seedDefaultCategories();
  }

  private async seedCurrencies(): Promise<void> {
    const repository = this.dataSource.getRepository(CurrencyTypeOrmEntity);
    const existing: number = await repository.count();
    if (existing > 0) {
      return;
    }
    const rows: CurrencyTypeOrmEntity[] = DEFAULT_CURRENCIES.map((c) =>
      repository.create({
        code: c.code,
        symbol: c.symbol,
        name: c.name,
      }),
    );
    await repository.save(rows);
    this.logger.log(`Seeded ${rows.length} currencies`);
  }

  private async seedTransactionTypes(): Promise<void> {
    const repository = this.dataSource.getRepository(
      TransactionTypeTypeOrmEntity,
    );
    const existing: number = await repository.count();
    if (existing > 0) {
      return;
    }
    const rows: TransactionTypeTypeOrmEntity[] = DEFAULT_TXN_TYPES.map((code) =>
      repository.create({ code }),
    );
    await repository.save(rows);
    this.logger.log(`Seeded ${rows.length} transaction types`);
  }

  private async seedDefaultCategories(): Promise<void> {
    const repository = this.dataSource.getRepository(CategoryTypeOrmEntity);
    const existingDefaults: number = await repository.count({
      where: { isDefault: true, userId: IsNull() },
    });
    if (existingDefaults > 0) {
      return;
    }
    const rows: CategoryTypeOrmEntity[] = DEFAULT_CATEGORIES.map((c) =>
      repository.create({
        name: c.name,
        icon: c.icon,
        isDefault: true,
        userId: null,
      }),
    );
    await repository.save(rows);
    this.logger.log(`Seeded ${rows.length} default categories`);
  }
}
