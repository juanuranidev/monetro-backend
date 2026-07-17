import { Inject, Injectable } from '@nestjs/common';

import type { TransactionType } from '@transaction/domain/entities/transaction-type';
import { TRANSACTION_TYPE_REPOSITORY } from '@transaction/domain/transaction-type-repository.token';
import { TransactionTypeItemResponseDto } from '@transaction/application/dtos/read-all-transaction-types/transaction-type-item-response.dto';
import type { ITransactionTypeRepository } from '@transaction/domain/ports/i-transaction-type-repository';
import { ReadAllTransactionTypesResponseDto } from '@transaction/application/dtos/read-all-transaction-types/read-all-transaction-types-response.dto';
import type { ReadAllTransactionTypesRequestDto } from '@transaction/application/dtos/read-all-transaction-types/read-all-transaction-types-request.dto';

@Injectable()
export class ReadAllTransactionTypesUseCase {
  public constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: ITransactionTypeRepository,
  ) {}

  public async execute(
    _input: ReadAllTransactionTypesRequestDto,
  ): Promise<ReadAllTransactionTypesResponseDto> {
    void _input;
    const types: readonly TransactionType[] =
      await this.transactionTypeRepository.findAll();
    const items: TransactionTypeItemResponseDto[] = types.map(
      (row: TransactionType) =>
        Object.assign(new TransactionTypeItemResponseDto(), {
          id: row.id,
          key: row.key,
          displayNameEs: row.displayNameEs,
        }),
    );
    return Object.assign(new ReadAllTransactionTypesResponseDto(), {
      items,
    });
  }
}
