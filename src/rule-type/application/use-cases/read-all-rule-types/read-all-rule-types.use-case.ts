import { Inject, Injectable } from '@nestjs/common';

import type { RuleTypeCatalog } from '@rule-type/domain/entities/rule-type-catalog';

import { ReadAllRuleTypesResponseDto } from '@rule-type/application/dtos/read-all-rule-types/read-all-rule-types-response.dto';

import { RULE_TYPE_CATALOG_REPOSITORY } from '@rule-type/domain/rule-type-catalog-repository.token';

import { RuleTypeCatalogItemResponseDto } from '@rule-type/application/dtos/read-all-rule-types/rule-type-catalog-item-response.dto';

import type { ReadAllRuleTypesRequestDto } from '@rule-type/application/dtos/read-all-rule-types/read-all-rule-types-request.dto';

import type { IRuleTypeCatalogRepository } from '@rule-type/domain/ports/i-rule-type-catalog-repository';

@Injectable()
export class ReadAllRuleTypesUseCase {
  public constructor(
    @Inject(RULE_TYPE_CATALOG_REPOSITORY)
    private readonly ruleTypeCatalogRepository: IRuleTypeCatalogRepository,
  ) {}

  public async execute(
    _input: ReadAllRuleTypesRequestDto,
  ): Promise<ReadAllRuleTypesResponseDto> {
    void _input;
    const types: readonly RuleTypeCatalog[] =
      await this.ruleTypeCatalogRepository.findAll();
    const data: RuleTypeCatalogItemResponseDto[] = types.map(
      (row: RuleTypeCatalog) => {
        const item: RuleTypeCatalogItemResponseDto =
          new RuleTypeCatalogItemResponseDto();
        item.id = row.id;
        item.name = row.name;
        item.key = row.key;
        if (row.description !== undefined) {
          item.description = row.description;
        }
        item.createdAt = row.createdAt.toISOString();
        item.updatedAt = row.updatedAt.toISOString();
        return item;
      },
    );
    const response: ReadAllRuleTypesResponseDto =
      new ReadAllRuleTypesResponseDto();
    response.success = true;
    response.status = 200;
    response.message = 'OK';
    response.data = data;
    return response;
  }
}
