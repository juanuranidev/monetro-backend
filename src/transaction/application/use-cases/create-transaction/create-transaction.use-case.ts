import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import { CREDIT_CARD_REPOSITORY } from '@credit-card/domain/credit-card-repository.token';

import type { ICreditCardRepository } from '@credit-card/domain/ports/i-credit-card-repository';

import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';

import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';

import { CURRENCY_REPOSITORY } from '@currency/domain/currency-repository.token';
import type { ICurrencyRepository } from '@currency/domain/ports/i-currency-repository';

import { MoneyAmount } from '@shared/domain/value-objects/money-amount';
import { TextFieldLimits } from '@shared/domain/constants/text-field-limits';
import { parseRecordInstantToUtc } from '@shared/domain/services/parse-record-instant-to-utc';

import { TRANSACTION_REPOSITORY } from '@transaction/domain/transaction-repository.token';
import { type TransactionCreateData } from '@transaction/domain/ports/types/transaction-create-data';
import { TRANSACTION_TYPE_REPOSITORY } from '@transaction/domain/transaction-type-repository.token';
import type { ITransactionRepository } from '@transaction/domain/ports/i-transaction-repository';
import type { ITransactionTypeRepository } from '@transaction/domain/ports/i-transaction-type-repository';
import type { CreateTransactionRequestDto } from '@transaction/application/dtos/create-transaction/create-transaction-request.dto';
import { mapTransactionToCreateResponseDto } from '@transaction/application/mappers/transaction-to-create-response.mapper';
import type { CreateTransactionResponseDto } from '@transaction/application/dtos/create-transaction/create-transaction-response.dto';
import { ApplyActiveRulesToTransactionDraftService } from '@transaction/application/services/apply-active-rules-to-transaction-draft.service';

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
    @Inject(CREDIT_CARD_REPOSITORY)
    private readonly creditCardRepository: ICreditCardRepository,
    private readonly configService: ConfigService,
    private readonly applyRulesToDraftService: ApplyActiveRulesToTransactionDraftService,
  ) {}

  public async execute(
    input: CreateTransactionRequestDto,
  ): Promise<CreateTransactionResponseDto> {
    const userId: string = input.userId;
    const hasAccountLeg: boolean = input.accountId !== undefined && input.accountId.length > 0;
    const hasCardLeg: boolean =
      input.creditCardId !== undefined && input.creditCardId.length > 0;
    if (hasAccountLeg === hasCardLeg) {
      throw new BadRequestException(
        'Exactly one of accountId or creditCardId must be provided',
      );
    }
    const uniqueCategoryIds: string[] = [...new Set(input.categoryIds)];
    let effectiveAccountIdForRules: string | undefined;
    let persistenceAccountId: string | undefined;
    let persistenceCreditCardId: string | undefined;
    if (hasAccountLeg && input.accountId !== undefined) {
      const account = await this.accountRepository.findOwnedByUser({
        accountId: input.accountId,
        userId,
      });
      if (account === undefined) {
        throw new BadRequestException('Account not found for current user');
      }
      persistenceAccountId = account.id;
      persistenceCreditCardId = undefined;
    } else if (hasCardLeg && input.creditCardId !== undefined) {
      const card = await this.creditCardRepository.findOwnedByUser({
        creditCardId: input.creditCardId,
        userId,
      });
      if (card === undefined) {
        throw new BadRequestException('Credit card not found for current user');
      }
      persistenceCreditCardId = card.id;
      persistenceAccountId = undefined;
      effectiveAccountIdForRules = card.accountId;
    }
    if (effectiveAccountIdForRules === undefined) {
      throw new BadRequestException('Could not resolve account for posting');
    }
    const effectiveAccount =
      await this.accountRepository.findOwnedByUser({
        accountId: effectiveAccountIdForRules,
        userId,
      });
    if (effectiveAccount === undefined) {
      throw new BadRequestException(
        'Posting account resolved from credit card is not accessible',
      );
    }
    for (const categoryId of uniqueCategoryIds) {
      const category = await this.categoryRepository.findAccessibleByUser({
        categoryId,
        userId,
      });
      if (category === undefined) {
        throw new BadRequestException('Category not found or not accessible');
      }
    }
    const currency = await this.currencyRepository.findByKey({
      key: input.currencyKey,
    });
    if (currency === undefined) {
      throw new BadRequestException('Unknown currency key');
    }
    if (effectiveAccount.currencyId !== currency.id) {
      throw new BadRequestException(
        'Transaction currency must match the effective account currency',
      );
    }
    const txnType = await this.transactionTypeRepository.findByKey({
      key: input.transactionTypeKey,
    });
    if (txnType === undefined) {
      throw new BadRequestException('Unknown transaction type');
    }
    let amount: MoneyAmount;
    try {
      amount = MoneyAmount.fromString(input.amount);
    } catch {
      throw new BadRequestException('Invalid monetary amount');
    }
    let excludeFromStats: boolean = input.excludeFromStats ?? false;
    const defaultTz: string = this.configService.get<string>(
      'APP_TIMEZONE',
      'UTC',
    );
    let recordDate: Date;
    try {
      recordDate = parseRecordInstantToUtc(input.recordDate, defaultTz);
    } catch {
      throw new BadRequestException('Invalid record instant');
    }
    const descriptionRaw: string =
      typeof input.description === 'string' ? input.description.trim() : '';
    if (descriptionRaw.length > TextFieldLimits.transactionDescription) {
      throw new BadRequestException('Description too long');
    }
    const draftAfterRules = await this.applyRulesToDraftService.execute({
      userId,
      description: descriptionRaw,
      accountId: effectiveAccountIdForRules,
      transactionTypeId: txnType.id,
      categoryIds: uniqueCategoryIds,
      excludeFromStats,
    });
    excludeFromStats = draftAfterRules.excludeFromStats;
    const mergedCategoryIds: string[] = draftAfterRules.categoryIds;
    for (const categoryId of mergedCategoryIds) {
      const category = await this.categoryRepository.findAccessibleByUser({
        categoryId,
        userId,
      });
      if (category === undefined) {
        throw new BadRequestException('Category not found or not accessible');
      }
    }
    const data: TransactionCreateData = {
      amount,
      description: descriptionRaw,
      recordDate,
      excludeFromStats,
      categoryIds: mergedCategoryIds,
      transactionTypeId: txnType.id,
      currencyId: currency.id,
      accountId: persistenceAccountId,
      creditCardId: persistenceCreditCardId,
    };
    const saved = await this.transactionRepository.create(data);
    return mapTransactionToCreateResponseDto(saved);
  }
}
