import { ConfigService } from '@nestjs/config';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';

import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';

import { CURRENCY_REPOSITORY } from '@currency/domain/currency-repository.token';
import type { ICurrencyRepository } from '@currency/domain/ports/i-currency-repository';

import { MoneyAmount } from '@shared/domain/value-objects/money-amount';
import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';
import { parseRecordInstantToUtc } from '@shared/domain/services/parse-record-instant-to-utc';

import { Transaction } from '@transaction/domain/entities/transaction';
import { TRANSACTION_REPOSITORY } from '@transaction/domain/transaction-repository.token';
import { TRANSACTION_TYPE_REPOSITORY } from '@transaction/domain/transaction-type-repository.token';
import type { ITransactionRepository } from '@transaction/domain/ports/i-transaction-repository';
import { CreateTransactionResponseDto } from '@transaction/application/dtos/create-transaction/create-transaction-response.dto';
import type { ITransactionTypeRepository } from '@transaction/domain/ports/i-transaction-type-repository';
import type { UpdateTransactionRequestDto } from '@transaction/application/dtos/update-transaction/update-transaction-request.dto';
import { ApplyActiveRulesToTransactionDraftService } from '@transaction/application/services/apply-active-rules-to-transaction-draft.service';

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
    private readonly configService: ConfigService,
    private readonly applyRulesToDraftService: ApplyActiveRulesToTransactionDraftService,
  ) {}

  public async execute(
    input: UpdateTransactionRequestDto,
  ): Promise<CreateTransactionResponseDto> {
    const existing: Transaction | undefined =
      await this.transactionRepository.findOwnedByUser(
        input.transactionId,
        input.userId,
      );
    if (existing === undefined) {
      throw new NotFoundException('Transaction not found');
    }
    let amount: MoneyAmount = existing.amount;
    if (input.body.amount !== undefined) {
      try {
        amount = MoneyAmount.fromString(input.body.amount);
      } catch {
        throw new BadRequestException('Invalid monetary amount');
      }
    }
    let description: string = existing.description;
    if (input.body.description !== undefined) {
      description = input.body.description.trim();
      if (description.length > TextFieldLimits.transactionDescription) {
        throw new BadRequestException('Description too long');
      }
    }
    let recordDate: Date = existing.recordDate;
    if (input.body.recordDate !== undefined) {
      const defaultTz: string = this.configService.get<string>(
        'APP_TIMEZONE',
        'UTC',
      );
      try {
        recordDate = parseRecordInstantToUtc(input.body.recordDate, defaultTz);
      } catch {
        throw new BadRequestException('Invalid record instant');
      }
    }
    let excludeFromStats: boolean =
      input.body.excludeFromStats !== undefined
        ? input.body.excludeFromStats
        : existing.excludeFromStats;
    let categoryIds: string[] =
      input.body.categoryIds !== undefined
        ? [...new Set(input.body.categoryIds)]
        : [...existing.categoryIds];
    let transactionTypeId: string = existing.transactionTypeId;
    if (input.body.transactionTypeKey !== undefined) {
      const txnType = await this.transactionTypeRepository.findByKey(
        input.body.transactionTypeKey,
      );
      if (txnType === undefined) {
        throw new BadRequestException('Unknown transaction type');
      }
      transactionTypeId = txnType.id;
    }
    let currencyId: string = existing.currencyId;
    if (input.body.currencyKey !== undefined) {
      const currency = await this.currencyRepository.findByKey(
        input.body.currencyKey,
      );
      if (currency === undefined) {
        throw new BadRequestException('Unknown currency key');
      }
      currencyId = currency.id;
    }
    const accountId: string =
      input.body.accountId !== undefined
        ? input.body.accountId
        : existing.accountId;
    const account = await this.accountRepository.findOwnedByUser(
      accountId,
      input.userId,
    );
    if (account === undefined) {
      throw new BadRequestException('Account not found for current user');
    }
    if (account.userId !== input.userId) {
      throw new BadRequestException('Account ownership mismatch');
    }
    if (account.currencyId !== currencyId) {
      throw new BadRequestException(
        'Transaction currency must match the account currency',
      );
    }
    for (const categoryId of categoryIds) {
      const category = await this.categoryRepository.findAccessibleByUser(
        categoryId,
        input.userId,
      );
      if (category === undefined) {
        throw new BadRequestException('Category not found or not accessible');
      }
    }
    const draftAfterRules = await this.applyRulesToDraftService.execute({
      userId: input.userId,
      description,
      accountId,
      transactionTypeId,
      categoryIds,
      excludeFromStats,
    });
    excludeFromStats = draftAfterRules.excludeFromStats;
    categoryIds = draftAfterRules.categoryIds;
    for (const categoryId of categoryIds) {
      const category = await this.categoryRepository.findAccessibleByUser(
        categoryId,
        input.userId,
      );
      if (category === undefined) {
        throw new BadRequestException('Category not found or not accessible');
      }
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
    );
    const saved: Transaction = await this.transactionRepository.update(
      updated,
      input.userId,
    );
    const response: CreateTransactionResponseDto =
      new CreateTransactionResponseDto();
    response.id = saved.id;
    response.amount = saved.amount.toPersistenceString();
    response.description = saved.description;
    response.recordDate = saved.recordDate.toISOString();
    response.excludeFromStats = saved.excludeFromStats;
    response.categoryIds = [...saved.categoryIds];
    response.transactionTypeId = saved.transactionTypeId;
    response.currencyId = saved.currencyId;
    response.accountId = saved.accountId;
    return response;
  }
}
