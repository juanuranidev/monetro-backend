import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Currency } from '@currency/domain/entities/currency';
import { CurrencyMapper } from '@currency/infrastructure/postgres/mappers/currency.mapper';
import { CurrencyTypeOrmEntity } from '@currency/infrastructure/postgres/entities/currency.typeorm-entity';
import type { ICurrencyRepository } from '@currency/domain/ports/i-currency-repository';

@Injectable()
export class CurrencyTypeOrmRepository implements ICurrencyRepository {
  public constructor(
    @InjectRepository(CurrencyTypeOrmEntity)
    private readonly repository: Repository<CurrencyTypeOrmEntity>,
  ) {}

  public async findAll(): Promise<readonly Currency[]> {
    const rows: CurrencyTypeOrmEntity[] = await this.repository.find({
      order: { key: 'ASC' },
    });
    return rows.map((row) => CurrencyMapper.fromPostgresToDomain(row));
  }

  public async findByKey(key: string): Promise<Currency | undefined> {
    const normalized: string = key.trim().toLowerCase();
    const row: CurrencyTypeOrmEntity | null = await this.repository.findOne({
      where: { key: normalized },
    });
    return row === null ? undefined : CurrencyMapper.fromPostgresToDomain(row);
  }
}
