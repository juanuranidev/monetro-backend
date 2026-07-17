import type { Currency } from '@currency/domain/entities/currency';
import type { CurrencyFindByKeyData } from '@currency/domain/ports/types/currency-find-by-key-data';

export interface ICurrencyRepository {
  findAll(): Promise<readonly Currency[]>;

  findByKey(data: CurrencyFindByKeyData): Promise<Currency | undefined>;
}
