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
      order: { code: 'ASC' },
    });
    return rows.map((row) => CurrencyMapper.fromPostgresToDomain(row));
  }

  public async findByCode(code: string): Promise<Currency | undefined> {
    const row: CurrencyTypeOrmEntity | null = await this.repository.findOne({
      where: { code: code.toUpperCase() },
    });
    return row === null ? undefined : CurrencyMapper.fromPostgresToDomain(row);
  }
}
