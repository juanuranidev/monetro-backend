import { ConfigService } from '@nestjs/config';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

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

import { Transaction } from '@transaction/domain/entities/transaction';
import { TRANSACTION_REPOSITORY } from '@transaction/domain/transaction-repository.token';
import { TRANSACTION_TYPE_REPOSITORY } from '@transaction/domain/transaction-type-repository.token';
import type { ITransactionRepository } from '@transaction/domain/ports/i-transaction-repository';
import type { ITransactionTypeRepository } from '@transaction/domain/ports/i-transaction-type-repository';
import type { UpdateTransactionRequestDto } from '@transaction/application/dtos/update-transaction/update-transaction-request.dto';
import { mapTransactionToCreateResponseDto } from '@transaction/application/mappers/transaction-to-create-response.mapper';
import type { CreateTransactionResponseDto } from '@transaction/application/dtos/create-transaction/create-transaction-response.dto';
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
    @Inject(CREDIT_CARD_REPOSITORY)
    private readonly creditCardRepository: ICreditCardRepository,
    private readonly configService: ConfigService,
    private readonly applyRulesToDraftService: ApplyActiveRulesToTransactionDraftService,
  ) {}

  public async execute(
    input: UpdateTransactionRequestDto,
  ): Promise<CreateTransactionResponseDto> {
    const existing: Transaction | undefined =
      await this.transactionRepository.findOwnedByUser({
        transactionId: input.transactionId,
        userId: input.userId,
      });
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
      const txnType = await this.transactionTypeRepository.findByKey({
        key: input.body.transactionTypeKey,
      });
      if (txnType === undefined) {
        throw new BadRequestException('Unknown transaction type');
      }
      transactionTypeId = txnType.id;
    }
    let currencyId: string = existing.currencyId;
    if (input.body.currencyKey !== undefined) {
      const currency = await this.currencyRepository.findByKey({
        key: input.body.currencyKey,
      });
      if (currency === undefined) {
        throw new BadRequestException('Unknown currency key');
      }
      currencyId = currency.id;
    }
    const patchAccountDefined: boolean = input.body.accountId !== undefined;
    const patchCardDefined: boolean = input.body.creditCardId !== undefined;
    if (patchAccountDefined && patchCardDefined) {
      throw new BadRequestException(
        'Provide at most one of accountId or creditCardId when changing posting leg',
      );
    }
    let persistenceAccountId: string | undefined = existing.accountId;
    let persistenceCreditCardId: string | undefined = existing.creditCardId;
    if (patchAccountDefined && input.body.accountId !== undefined) {
      persistenceAccountId = input.body.accountId;
      persistenceCreditCardId = undefined;
    }
    if (patchCardDefined && input.body.creditCardId !== undefined) {
      persistenceCreditCardId = input.body.creditCardId;
      persistenceAccountId = undefined;
    }
    const xorOk: boolean =
      (persistenceAccountId !== undefined &&
        persistenceAccountId !== '' &&
        persistenceCreditCardId === undefined) ||
      (persistenceCreditCardId !== undefined &&
        persistenceCreditCardId !== '' &&
        persistenceAccountId === undefined);
    if (!xorOk) {
      throw new BadRequestException('Invalid posting leg state after patch');
    }
    let effectiveAccountIdForRules: string | undefined;
    if (
      persistenceAccountId !== undefined &&
      persistenceAccountId.length > 0
    ) {
      const account = await this.accountRepository.findOwnedByUser({
        accountId: persistenceAccountId,
        userId: input.userId,
      });
      if (account === undefined) {
        throw new BadRequestException('Account not found for current user');
      }
      effectiveAccountIdForRules = account.id;
    } else if (
      persistenceCreditCardId !== undefined &&
      persistenceCreditCardId.length > 0
    ) {
      const card = await this.creditCardRepository.findOwnedByUser({
        creditCardId: persistenceCreditCardId,
        userId: input.userId,
      });
      if (card === undefined) {
        throw new BadRequestException('Credit card not found for current user');
      }
      effectiveAccountIdForRules = card.accountId;
    }
    if (effectiveAccountIdForRules === undefined) {
      throw new BadRequestException('Could not resolve account for posting');
    }
    const effectiveAccount =
      await this.accountRepository.findOwnedByUser({
        accountId: effectiveAccountIdForRules,
        userId: input.userId,
      });
    if (effectiveAccount === undefined) {
      throw new BadRequestException(
        'Posting account resolved from credit card is not accessible',
      );
    }
    if (effectiveAccount.currencyId !== currencyId) {
      throw new BadRequestException(
        'Transaction currency must match the effective account currency',
      );
    }
    for (const categoryId of categoryIds) {
      const category = await this.categoryRepository.findAccessibleByUser({
        categoryId,
        userId: input.userId,
      });
      if (category === undefined) {
        throw new BadRequestException('Category not found or not accessible');
      }
    }
    const draftAfterRules = await this.applyRulesToDraftService.execute({
      userId: input.userId,
      description,
      accountId: effectiveAccountIdForRules,
      transactionTypeId,
      categoryIds,
      excludeFromStats,
    });
    excludeFromStats = draftAfterRules.excludeFromStats;
    categoryIds = draftAfterRules.categoryIds;
    for (const categoryId of categoryIds) {
      const category = await this.categoryRepository.findAccessibleByUser({
        categoryId,
        userId: input.userId,
      });
      if (category === undefined) {
        throw new BadRequestException('Category not found or not accessible');
      }
    }
    const saved: Transaction = await this.transactionRepository.update({
      id: existing.id,
      ownerUserId: input.userId,
      amount,
      description,
      recordDate,
      excludeFromStats,
      categoryIds,
      transactionTypeId,
      currencyId,
      accountId: persistenceAccountId,
      creditCardId: persistenceCreditCardId,
    });
    return mapTransactionToCreateResponseDto(saved);
  }
}
