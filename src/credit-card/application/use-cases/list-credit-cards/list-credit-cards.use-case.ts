import { Inject, Injectable } from '@nestjs/common';

import type { CreditCard } from '@credit-card/domain/entities/credit-card';

import { CREDIT_CARD_REPOSITORY } from '@credit-card/domain/credit-card-repository.token';

import type { ICreditCardRepository } from '@credit-card/domain/ports/i-credit-card-repository';

import { CreateCreditCardResponseDto } from '@credit-card/application/dtos/create-credit-card/create-credit-card-response.dto';

import type { ListCreditCardsRequestDto } from '@credit-card/application/dtos/list-credit-cards/list-credit-cards-request.dto';

@Injectable()
export class ListCreditCardsUseCase {
  public constructor(
    @Inject(CREDIT_CARD_REPOSITORY)
    private readonly creditCardRepository: ICreditCardRepository,
  ) {}

  public async execute(
    input: ListCreditCardsRequestDto,
  ): Promise<CreateCreditCardResponseDto[]> {
    const rows: readonly CreditCard[] =
      await this.creditCardRepository.findAllByAccountAndUser({
        accountId: input.accountId,
        userId: input.userId,
      });
    return rows.map((card: CreditCard) => this.toResponse(card));
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
