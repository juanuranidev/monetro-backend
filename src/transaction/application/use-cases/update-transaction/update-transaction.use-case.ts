import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';

import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';

import { CURRENCY_REPOSITORY } from '@currency/domain/currency-repository.token';
import type { ICurrencyRepository } from '@currency/domain/ports/i-currency-repository';

import { MoneyAmount } from '@shared/domain/value-objects/money-amount';

import { Transaction } from '@transaction/domain/entities/transaction';
import { TRANSACTION_REPOSITORY } from '@transaction/domain/transaction-repository.token';
import { TRANSACTION_TYPE_REPOSITORY } from '@transaction/domain/transaction-type-repository.token';
import type { ITransactionRepository } from '@transaction/domain/ports/i-transaction-repository';
import type { ITransactionTypeRepository } from '@transaction/domain/ports/i-transaction-type-repository';
import { CreateTransactionResponseDto } from '@transaction/application/dtos/create-transaction/create-transaction-response.dto';
import type { UpdateTransactionBodyDto } from '@transaction/application/dtos/update-transaction/update-transaction-body.dto';

@Injectable()
export class UpdateTransactionUseCase {
  public constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: ITransactionTypeRepository,
    @Inject(CURRENCY_REPOSITORY)
    private readonly currencyRepository: ICurrencyRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
  ) {}

  public async execute(params: {
    readonly transactionId: string;
    readonly userId: string;
    readonly body: UpdateTransactionBodyDto;
  }): Promise<CreateTransactionResponseDto> {
    const existing: Transaction | undefined =
      await this.transactionRepository.findOwnedByUser(
        params.transactionId,
        params.userId,
      );
    if (existing === undefined) {
      throw new NotFoundException('Transaction not found');
    }
    let amount: MoneyAmount = existing.amount;
    if (params.body.amount !== undefined) {
      try {
        amount = MoneyAmount.fromString(params.body.amount);
      } catch {
        throw new BadRequestException('Invalid monetary amount');
      }
    }
    const description: string =
      params.body.description !== undefined
        ? params.body.description.trim()
        : existing.description;
    let recordDate: Date = existing.recordDate;
    if (params.body.recordDate !== undefined) {
      const parsed: Date = new Date(`${params.body.recordDate}T00:00:00.000Z`);
      if (Number.isNaN(parsed.getTime())) {
        throw new BadRequestException('Invalid record date');
      }
      recordDate = parsed;
    }
    const excludeFromStats: boolean =
      params.body.excludeFromStats !== undefined
        ? params.body.excludeFromStats
        : existing.excludeFromStats;
    const categoryIds: string[] =
      params.body.categoryIds !== undefined
        ? [...new Set(params.body.categoryIds)]
        : [...existing.categoryIds];
    for (const categoryId of categoryIds) {
      const category = await this.categoryRepository.findAccessibleByUser(
        categoryId,
        params.userId,
      );
      if (category === undefined) {
        throw new BadRequestException('Category not found or not accessible');
      }
    }
    let transactionTypeId: string = existing.transactionTypeId;
    if (params.body.transactionTypeCode !== undefined) {
      const txnType = await this.transactionTypeRepository.findByCode(
        params.body.transactionTypeCode,
      );
      if (txnType === undefined) {
        throw new BadRequestException('Unknown transaction type');
      }
      transactionTypeId = txnType.id;
    }
    let currencyId: string = existing.currencyId;
    if (params.body.currencyCode !== undefined) {
      const currency = await this.currencyRepository.findByCode(
        params.body.currencyCode.toUpperCase(),
      );
      if (currency === undefined) {
        throw new BadRequestException('Unknown currency code');
      }
      currencyId = currency.id;
    }
    let accountId: string =
      params.body.accountId !== undefined
        ? params.body.accountId
        : existing.accountId;
    const account = await this.accountRepository.findOwnedByUser(
      accountId,
      params.userId,
    );
    if (account === undefined) {
      throw new BadRequestException('Account not found for current user');
    }
    if (account.currencyId !== currencyId) {
      throw new BadRequestException(
        'Transaction currency must match the account currency',
      );
    }
    const updated: Transaction = new Transaction(
      existing.id,
      amount,
      description,
      recordDate,
      excludeFromStats,
      categoryIds,
      transactionTypeId,
      currencyId,
      accountId,
      existing.userId,
    );
    const saved: Transaction =
      await this.transactionRepository.update(updated);
    const response: CreateTransactionResponseDto =
      new CreateTransactionResponseDto();
    response.id = saved.id;
    response.amount = saved.amount.toPersistenceString();
    response.description = saved.description;
    response.recordDate = saved.recordDate.toISOString().slice(0, 10);
    response.excludeFromStats = saved.excludeFromStats;
    response.categoryIds = [...saved.categoryIds];
    response.transactionTypeId = saved.transactionTypeId;
    response.currencyId = saved.currencyId;
    response.accountId = saved.accountId;
    return response;
  }
}
