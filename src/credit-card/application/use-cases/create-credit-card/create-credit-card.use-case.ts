import {
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import type { CreditCard } from '@credit-card/domain/entities/credit-card';

import { CREDIT_CARD_REPOSITORY } from '@credit-card/domain/credit-card-repository.token';

import type { CreditCardCreateData } from '@credit-card/domain/ports/types/credit-card-create-data';

import type { ICreditCardRepository } from '@credit-card/domain/ports/i-credit-card-repository';

import { CreateCreditCardResponseDto } from '@credit-card/application/dtos/create-credit-card/create-credit-card-response.dto';

import type { CreateCreditCardRequestDto } from '@credit-card/application/dtos/create-credit-card/create-credit-card-request.dto';

import { CREDIT_CARD_TIER_CATALOG_REPOSITORY } from '@credit-card/domain/credit-card-tier-catalog-repository.token';

import { CREDIT_CARD_BRAND_CATALOG_REPOSITORY } from '@credit-card/domain/credit-card-brand-catalog-repository.token';

import type { ICreditCardTierCatalogRepository } from '@credit-card/domain/ports/i-credit-card-tier-catalog-repository';

import type { ICreditCardBrandCatalogRepository } from '@credit-card/domain/ports/i-credit-card-brand-catalog-repository';

import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';

import { MoneyAmount } from '@shared/domain/value-objects/money-amount';

@Injectable()
export class CreateCreditCardUseCase {
  public constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(CREDIT_CARD_BRAND_CATALOG_REPOSITORY)
    private readonly brandCatalogRepository: ICreditCardBrandCatalogRepository,
    @Inject(CREDIT_CARD_TIER_CATALOG_REPOSITORY)
    private readonly tierCatalogRepository: ICreditCardTierCatalogRepository,
    @Inject(CREDIT_CARD_REPOSITORY)
    private readonly creditCardRepository: ICreditCardRepository,
  ) {}

  public async execute(
    input: CreateCreditCardRequestDto,
  ): Promise<CreateCreditCardResponseDto> {
    const account = await this.accountRepository.findOwnedByUser({
      accountId: input.accountId,
      userId: input.userId,
    });
    if (account === undefined) {
      throw new BadRequestException('Account not found for current user');
    }
    const brand = await this.brandCatalogRepository.findByKey({
      key: input.brandKey,
    });
    if (brand === undefined) {
      throw new BadRequestException('Unknown credit card brand key');
    }
    const tier = await this.tierCatalogRepository.findByKey({
      key: input.tierKey,
    });
    if (tier === undefined) {
      throw new BadRequestException('Unknown credit card tier key');
    }
    let creditLimit: MoneyAmount | undefined;
    if (input.creditLimit !== undefined && input.creditLimit.trim().length > 0) {
      try {
        creditLimit = MoneyAmount.fromString(input.creditLimit.trim());
      } catch {
        throw new BadRequestException('Invalid credit limit amount');
      }
    }
    const data: CreditCardCreateData = {
      accountId: input.accountId,
      brandId: brand.id,
      tierId: tier.id,
      lastSixDigits: input.lastSixDigits,
      expiryMonth: input.expiryMonth,
      expiryYear: input.expiryYear,
      creditLimit,
    };
    const saved = await this.creditCardRepository.create(data);
    return this.toResponse(saved);
  }

  private toResponse(card: CreditCard): CreateCreditCardResponseDto {
    return Object.assign(new CreateCreditCardResponseDto(), {
      id: card.id,
      accountId: card.accountId,
      brandId: card.brandId,
      tierId: card.tierId,
      lastSixDigits: card.lastSixDigits,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      ...(card.creditLimit !== undefined
        ? { creditLimit: card.creditLimit.toPersistenceString() }
        : {}),
    });
  }
}
