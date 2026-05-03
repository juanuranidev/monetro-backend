import { Inject, Injectable } from '@nestjs/common';

import type { Transaction } from '@transaction/domain/entities/transaction';
import { TRANSACTION_REPOSITORY } from '@transaction/domain/transaction-repository.token';
import type { ITransactionRepository } from '@transaction/domain/ports/i-transaction-repository';
import { CreateTransactionResponseDto } from '@transaction/application/dtos/create-transaction/create-transaction-response.dto';
import type { GetTransactionsRequestDto } from '@transaction/application/dtos/get-transactions/get-transactions-request.dto';

@Injectable()
export class GetTransactionsUseCase {
  public constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  public async execute(
    input: GetTransactionsRequestDto,
  ): Promise<CreateTransactionResponseDto[]> {
    const rows: readonly Transaction[] =
      await this.transactionRepository.findAllByUserId(input.userId);
    return rows.map((saved: Transaction) => {
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
    });
  }
}
