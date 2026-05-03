import { InjectDataSource } from '@nestjs/typeorm';
import { Logger, Injectable, OnModuleInit } from '@nestjs/common';

import { IsNull, DataSource } from 'typeorm';

import { CategoryTypeOrmEntity } from '@category/infrastructure/postgres/entities/category.typeorm-entity';

import { CurrencyTypeOrmEntity } from '@currency/infrastructure/postgres/entities/currency.typeorm-entity';

import { RuleBaseCatalogTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-base-catalog.typeorm-entity';

import { RuleTypeBasePivotTypeOrmEntity } from '@rule-base/infrastructure/postgres/entities/rule-type-base-pivot.typeorm-entity';

import { RuleTypeCatalogTypeOrmEntity } from '@rule-type/infrastructure/postgres/entities/rule-type-catalog.typeorm-entity';

import { TransactionTypeTypeOrmEntity } from '@transaction/infrastructure/postgres/entities/transaction-type.typeorm-entity';

const DEFAULT_CURRENCIES: readonly {
  readonly code: string;
  readonly symbol: string;
  readonly name: string;
}[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '\u20AC', name: 'Euro' },
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

const RULE_TYPE_SEEDS: readonly {
  readonly key: string;
  readonly name: string;
  readonly description: string;
}[] = [
  {
    key: 'categorization',
    name: 'Categorization',
    description: 'Rules that assign or adjust how transactions are categorized.',
  },
  {
    key: 'exclusion',
    name: 'Exclusion',
    description: 'Rules that exclude transactions from statistics or reports.',
  },
] as const;

const RULE_BASE_SEEDS: readonly {
  readonly key: string;
  readonly name: string;
}[] = [
  { key: 'keyword', name: 'Keyword' },
  { key: 'account', name: 'Account' },
  { key: 'category', name: 'Category' },
  { key: 'transaction_type', name: 'Transaction type' },
] as const;

const RULE_TYPE_BASE_PAIRS: readonly [string, string][] = [
  ['categorization', 'keyword'],
  ['categorization', 'account'],
  ['categorization', 'transaction_type'],
  ['exclusion', 'keyword'],
  ['exclusion', 'category'],
  ['exclusion', 'account'],
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
    await this.seedRuleCatalogs();
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

  private async seedRuleCatalogs(): Promise<void> {
    const typeRepository = this.dataSource.getRepository(
      RuleTypeCatalogTypeOrmEntity,
    );
    const existingTypes: number = await typeRepository.count();
    if (existingTypes > 0) {
      return;
    }
    const typeRows: RuleTypeCatalogTypeOrmEntity[] = RULE_TYPE_SEEDS.map((row) =>
      typeRepository.create({
        key: row.key,
        name: row.name,
        description: row.description,
      }),
    );
    const savedTypes: RuleTypeCatalogTypeOrmEntity[] =
      await typeRepository.save(typeRows);
    const baseRepository = this.dataSource.getRepository(
      RuleBaseCatalogTypeOrmEntity,
    );
    const baseRows: RuleBaseCatalogTypeOrmEntity[] = RULE_BASE_SEEDS.map((row) =>
      baseRepository.create({
        key: row.key,
        name: row.name,
      }),
    );
    const savedBases: RuleBaseCatalogTypeOrmEntity[] =
      await baseRepository.save(baseRows);
    const typeIdByKey: Map<string, string> = new Map(
      savedTypes.map((t: RuleTypeCatalogTypeOrmEntity) => [t.key, t.id]),
    );
    const baseIdByKey: Map<string, string> = new Map(
      savedBases.map((b: RuleBaseCatalogTypeOrmEntity) => [b.key, b.id]),
    );
    const pivotRepository = this.dataSource.getRepository(
      RuleTypeBasePivotTypeOrmEntity,
    );
    const pivotRows: RuleTypeBasePivotTypeOrmEntity[] = RULE_TYPE_BASE_PAIRS.map(
      (pair: readonly [string, string]) => {
        const typeId: string | undefined = typeIdByKey.get(pair[0]);
        const baseId: string | undefined = baseIdByKey.get(pair[1]);
        if (typeId === undefined || baseId === undefined) {
          throw new Error('Invalid rule catalog seed pair');
        }
        return pivotRepository.create({
          ruleTypeId: typeId,
          ruleBaseId: baseId,
        });
      },
    );
    await pivotRepository.save(pivotRows);
    this.logger.log(
      `Seeded ${savedTypes.length} rule types, ${savedBases.length} rule bases, ${pivotRows.length} pivot rows`,
    );
  }
}
