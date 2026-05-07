import type { Currency } from '@currency/domain/entities/currency';

export interface ICurrencyRepository {
  findAll(): Promise<readonly Currency[]>;
  findByKey(key: string): Promise<Currency | undefined>;
}
