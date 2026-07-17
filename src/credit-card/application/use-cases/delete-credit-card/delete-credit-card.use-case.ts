import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { CREDIT_CARD_REPOSITORY } from '@credit-card/domain/credit-card-repository.token';

import type { ICreditCardRepository } from '@credit-card/domain/ports/i-credit-card-repository';

import type { ScopedCreditCardActionRequestDto } from '@credit-card/application/dtos/scoped/scoped-credit-card-action-request.dto';

@Injectable()
export class DeleteCreditCardUseCase {
  public constructor(
    @Inject(CREDIT_CARD_REPOSITORY)
    private readonly creditCardRepository: ICreditCardRepository,
  ) {}

  public async execute(input: ScopedCreditCardActionRequestDto): Promise<void> {
    const existing = await this.creditCardRepository.findOwnedByUser({
      creditCardId: input.creditCardId,
      userId: input.userId,
    });
    if (existing === undefined) {
      throw new NotFoundException('Credit card not found');
    }
    if (existing.accountId !== input.accountId) {
      throw new BadRequestException(
        'Credit card is not associated with this account',
      );
    }
    await this.creditCardRepository.deleteOwned({
      creditCardId: input.creditCardId,
      userId: input.userId,
    });
  }
}
