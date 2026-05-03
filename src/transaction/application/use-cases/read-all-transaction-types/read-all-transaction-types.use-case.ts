import { Inject, Injectable } from '@nestjs/common';

import { TRANSACTION_TYPE_REPOSITORY } from '@transaction/domain/transaction-type-repository.token';
import type { TransactionType } from '@transaction/domain/entities/transaction-type';
import type { ITransactionTypeRepository } from '@transaction/domain/ports/i-transaction-type-repository';
import { TransactionTypeItemResponseDto } from '@transaction/application/dtos/read-all-transaction-types/transaction-type-item-response.dto';

@Injectable()
export class ReadAllTransactionTypesUseCase {
  public constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: ITransactionTypeRepository,
  ) {}

  public async execute(): Promise<TransactionTypeItemResponseDto[]> {
    const types: readonly TransactionType[] =
      await this.transactionTypeRepository.findAll();
    return types.map((row: TransactionType) => {
      const dto: TransactionTypeItemResponseDto =
        new TransactionTypeItemResponseDto();
      dto.id = row.id;
      dto.code = row.code;
      return dto;
    });
  }
}
