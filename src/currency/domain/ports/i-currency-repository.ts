import type { Currency } from '../entities/currency';

export interface ICurrencyRepository {
  findAll(): Promise<readonly Currency[]>;
  findByCode(code: string): Promise<Currency | undefined>;
}
