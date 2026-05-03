import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';

import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';

import { CURRENCY_REPOSITORY } from '@currency/domain/currency-repository.token';
import type { ICurrencyRepository } from '@currency/domain/ports/i-currency-repository';

import { MoneyAmount } from '@shared/domain/value-objects/money-amount';

import { type TransactionCreateData } from '@transaction/domain/entities/transaction';
import { TRANSACTION_REPOSITORY } from '@transaction/domain/transaction-repository.token';
import { TRANSACTION_TYPE_REPOSITORY } from '@transaction/domain/transaction-type-repository.token';
import type { ITransactionRepository } from '@transaction/domain/ports/i-transaction-repository';
import { CreateTransactionResponseDto } from '@transaction/application/dtos/create-transaction/create-transaction-response.dto';
import type { ITransactionTypeRepository } from '@transaction/domain/ports/i-transaction-type-repository';
import type { CreateTransactionRequestDto } from '@transaction/application/dtos/create-transaction/create-transaction-request.dto';

@Injectable()
export class CreateTransactionUseCase {
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

  public async execute(
    input: CreateTransactionRequestDto,
  ): Promise<CreateTransactionResponseDto> {
    const userId: string = input.userId;
    const uniqueCategoryIds: string[] = [...new Set(input.categoryIds)];
    for (const categoryId of uniqueCategoryIds) {
      const category = await this.categoryRepository.findAccessibleByUser(
        categoryId,
        userId,
      );
      if (category === undefined) {
        throw new BadRequestException('Category not found or not accessible');
      }
    }
    const account = await this.accountRepository.findOwnedByUser(
      input.accountId,
      userId,
    );
    if (account === undefined) {
      throw new BadRequestException('Account not found for current user');
    }
    const currency = await this.currencyRepository.findByCode(
      input.currencyCode.toUpperCase(),
    );
    if (currency === undefined) {
      throw new BadRequestException('Unknown currency code');
    }
    if (account.currencyId !== currency.id) {
      throw new BadRequestException(
        'Transaction currency must match the account currency',
      );
    }
    const txnType = await this.transactionTypeRepository.findByCode(
      input.transactionTypeCode,
    );
    if (txnType === undefined) {
      throw new BadRequestException('Unknown transaction type');
    }
    let amount: MoneyAmount;
    try {
      amount = MoneyAmount.fromString(input.amount);
    } catch {
      throw new BadRequestException('Invalid monetary amount');
    }
    const excludeFromStats: boolean = input.excludeFromStats ?? false;
    const recordDate: Date = new Date(`${input.recordDate}T00:00:00.000Z`);
    if (Number.isNaN(recordDate.getTime())) {
      throw new BadRequestException('Invalid record date');
    }
    const data: TransactionCreateData = {
      amount,
      description: input.description.trim(),
      recordDate,
      excludeFromStats,
      categoryIds: uniqueCategoryIds,
      transactionTypeId: txnType.id,
      currencyId: currency.id,
      accountId: input.accountId,
      userId,
    };
    const saved = await this.transactionRepository.create(data);
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
