import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import type { CreditCard } from '@credit-card/domain/entities/credit-card';

import { CREDIT_CARD_REPOSITORY } from '@credit-card/domain/credit-card-repository.token';

import type { CreditCardUpdateData } from '@credit-card/domain/ports/types/credit-card-update-data';

import type { ICreditCardRepository } from '@credit-card/domain/ports/i-credit-card-repository';

import { CreateCreditCardResponseDto } from '@credit-card/application/dtos/create-credit-card/create-credit-card-response.dto';

import type { UpdateCreditCardBodyDto } from '@credit-card/application/dtos/update-credit-card/update-credit-card-body.dto';

import type { UpdateCreditCardRequestDto } from '@credit-card/application/dtos/update-credit-card/update-credit-card-request.dto';

import { CREDIT_CARD_TIER_CATALOG_REPOSITORY } from '@credit-card/domain/credit-card-tier-catalog-repository.token';

import { CREDIT_CARD_BRAND_CATALOG_REPOSITORY } from '@credit-card/domain/credit-card-brand-catalog-repository.token';

import type { ICreditCardTierCatalogRepository } from '@credit-card/domain/ports/i-credit-card-tier-catalog-repository';

import type { ICreditCardBrandCatalogRepository } from '@credit-card/domain/ports/i-credit-card-brand-catalog-repository';

import { MoneyAmount } from '@shared/domain/value-objects/money-amount';

@Injectable()
export class UpdateCreditCardUseCase {
  public constructor(
    @Inject(CREDIT_CARD_REPOSITORY)
    private readonly creditCardRepository: ICreditCardRepository,
    @Inject(CREDIT_CARD_BRAND_CATALOG_REPOSITORY)
    private readonly brandCatalogRepository: ICreditCardBrandCatalogRepository,
    @Inject(CREDIT_CARD_TIER_CATALOG_REPOSITORY)
    private readonly tierCatalogRepository: ICreditCardTierCatalogRepository,
  ) {}

  public async execute(
    input: UpdateCreditCardRequestDto,
  ): Promise<CreateCreditCardResponseDto> {
    const patch: UpdateCreditCardBodyDto = input.body;
    if (!this.hasPatchFields(patch)) {
      throw new BadRequestException('No fields to update');
    }
    const existing: CreditCard | undefined =
      await this.creditCardRepository.findOwnedByUser({
        creditCardId: input.creditCardId,
        userId: input.userId,
      });
    if (existing === undefined) {
      throw new NotFoundException('Credit card not found');
    }
    if (existing.accountId !== input.accountId) {
      throw new BadRequestException('Credit card is not associated with this account');
    }
    let brandId: string = existing.brandId;
    let tierId: string = existing.tierId;
    if (patch.brandKey !== undefined) {
      const brand = await this.brandCatalogRepository.findByKey({
        key: patch.brandKey,
      });
      if (brand === undefined) {
        throw new BadRequestException('Unknown credit card brand key');
      }
      brandId = brand.id;
    }
    if (patch.tierKey !== undefined) {
      const tier = await this.tierCatalogRepository.findByKey({
        key: patch.tierKey,
      });
      if (tier === undefined) {
        throw new BadRequestException('Unknown credit card tier key');
      }
      tierId = tier.id;
    }
    let lastSixDigits: string =
      patch.lastSixDigits !== undefined ? patch.lastSixDigits.trim() : existing.lastSixDigits;
    let expiryMonth: number =
      patch.expiryMonth !== undefined ? patch.expiryMonth : existing.expiryMonth;
    let expiryYear: number =
      patch.expiryYear !== undefined ? patch.expiryYear : existing.expiryYear;
    let creditLimit: MoneyAmount | undefined = existing.creditLimit;
    if (patch.clearCreditLimit === true && patch.creditLimit === undefined) {
      creditLimit = undefined;
    } else if (patch.creditLimit !== undefined) {
      try {
        creditLimit = MoneyAmount.fromString(patch.creditLimit.trim());
      } catch {
        throw new BadRequestException('Invalid credit limit amount');
      }
    }
    const data: CreditCardUpdateData = {
      id: existing.id,
      ownerUserId: input.userId,
      brandId,
      tierId,
      lastSixDigits,
      expiryMonth,
      expiryYear,
      creditLimit,
    };
    const saved = await this.creditCardRepository.update(data);
    return Object.assign(new CreateCreditCardResponseDto(), {
      id: saved.id,
      accountId: saved.accountId,
      brandId: saved.brandId,
      tierId: saved.tierId,
      lastSixDigits: saved.lastSixDigits,
      expiryMonth: saved.expiryMonth,
      expiryYear: saved.expiryYear,
      ...(saved.creditLimit !== undefined
        ? { creditLimit: saved.creditLimit.toPersistenceString() }
        : {}),
    });
  }

  private hasPatchFields(patch: UpdateCreditCardBodyDto): boolean {
    return (
      patch.brandKey !== undefined ||
      patch.tierKey !== undefined ||
      patch.lastSixDigits !== undefined ||
      patch.expiryMonth !== undefined ||
      patch.expiryYear !== undefined ||
      patch.creditLimit !== undefined ||
      patch.clearCreditLimit === true
    );
  }
}
