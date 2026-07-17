import { Inject, Injectable } from '@nestjs/common';

import type { RuleTypeCatalog } from '@rule-type/domain/entities/rule-type-catalog';

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
  ): Promise<RuleTypeCatalogItemResponseDto[]> {
    void _input;
    const types: readonly RuleTypeCatalog[] =
      await this.ruleTypeCatalogRepository.findAll();
    const data: RuleTypeCatalogItemResponseDto[] = types.map(
      (row: RuleTypeCatalog) =>
        Object.assign(new RuleTypeCatalogItemResponseDto(), {
          id: row.id,
          name: row.name,
          key: row.key,
          ...(row.description !== undefined
            ? { description: row.description }
            : {}),
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        }),
    );
    return data;
  }
}
