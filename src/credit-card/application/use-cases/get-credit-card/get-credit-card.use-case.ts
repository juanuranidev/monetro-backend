import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import type { CreditCard } from '@credit-card/domain/entities/credit-card';

import { CREDIT_CARD_REPOSITORY } from '@credit-card/domain/credit-card-repository.token';

import type { ICreditCardRepository } from '@credit-card/domain/ports/i-credit-card-repository';

import { CreateCreditCardResponseDto } from '@credit-card/application/dtos/create-credit-card/create-credit-card-response.dto';

import type { ScopedCreditCardActionRequestDto } from '@credit-card/application/dtos/scoped/scoped-credit-card-action-request.dto';

@Injectable()
export class GetCreditCardUseCase {
  public constructor(
    @Inject(CREDIT_CARD_REPOSITORY)
    private readonly creditCardRepository: ICreditCardRepository,
  ) {}

  public async execute(
    input: ScopedCreditCardActionRequestDto,
  ): Promise<CreateCreditCardResponseDto | undefined> {
    const row: CreditCard | undefined =
      await this.creditCardRepository.findOwnedByUser({
        creditCardId: input.creditCardId,
        userId: input.userId,
      });
    if (row === undefined) {
      return undefined;
    }
    if (row.accountId !== input.accountId) {
      throw new BadRequestException('Credit card is not associated with this account');
    }
    return this.toResponse(row);
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
