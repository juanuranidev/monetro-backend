import type { Currency } from '@currency/domain/entities/currency';

export interface ICurrencyRepository {
  findAll(): Promise<readonly Currency[]>;
  findByCode(code: string): Promise<Currency | undefined>;
}
