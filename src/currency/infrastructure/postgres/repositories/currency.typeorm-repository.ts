import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../../../domain/entities/currency';
import type { ICurrencyRepository } from '../../../domain/ports/i-currency-repository';
import { CurrencyMapper } from '../mappers/currency.mapper';
import { CurrencyTypeOrmEntity } from '../entities/currency.typeorm-entity';

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
