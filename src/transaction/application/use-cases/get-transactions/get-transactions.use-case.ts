import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import type { Transaction } from '@transaction/domain/entities/transaction';
import { TRANSACTION_REPOSITORY } from '@transaction/domain/transaction-repository.token';
import type { ITransactionRepository } from '@transaction/domain/ports/i-transaction-repository';
import type { GetTransactionsRequestDto } from '@transaction/application/dtos/get-transactions/get-transactions-request.dto';
import type { CreateTransactionResponseDto } from '@transaction/application/dtos/create-transaction/create-transaction-response.dto';
import { mapTransactionToCreateResponseDto } from '@transaction/application/mappers/transaction-to-create-response.mapper';

@Injectable()
export class GetTransactionsUseCase {
  public constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  public async execute(
    input: GetTransactionsRequestDto,
  ): Promise<CreateTransactionResponseDto[]> {
    const hasAccountScope: boolean =
      input.accountId !== undefined && input.accountId.length > 0;
    const hasCardScope: boolean =
      input.creditCardId !== undefined && input.creditCardId.length > 0;
    if (hasAccountScope && hasCardScope) {
      throw new BadRequestException(
        'Specify at most one of accountId or creditCardId as list filter',
      );
    }
    const rows: readonly Transaction[] =
      await this.transactionRepository.findAllByUserId({
        userId: input.userId,
        ...(hasAccountScope && input.accountId !== undefined
          ? { accountId: input.accountId }
          : {}),
        ...(hasCardScope && input.creditCardId !== undefined
          ? { creditCardId: input.creditCardId }
          : {}),
      });
    return rows.map((saved: Transaction) =>
      mapTransactionToCreateResponseDto(saved),
    );
  }
}
