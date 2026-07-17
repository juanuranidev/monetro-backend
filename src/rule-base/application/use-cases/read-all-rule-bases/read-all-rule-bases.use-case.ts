import { Inject, Injectable } from '@nestjs/common';

import type { RuleBaseCatalog } from '@rule-base/domain/entities/rule-base-catalog';

import { RULE_BASE_CATALOG_REPOSITORY } from '@rule-base/domain/rule-base-catalog-repository.token';

import { RuleBaseCatalogItemResponseDto } from '@rule-base/application/dtos/read-all-rule-bases/rule-base-catalog-item-response.dto';

import type { ReadAllRuleBasesRequestDto } from '@rule-base/application/dtos/read-all-rule-bases/read-all-rule-bases-request.dto';

import type { IRuleBaseCatalogRepository } from '@rule-base/domain/ports/i-rule-base-catalog-repository';

@Injectable()
export class ReadAllRuleBasesUseCase {
  public constructor(
    @Inject(RULE_BASE_CATALOG_REPOSITORY)
    private readonly ruleBaseCatalogRepository: IRuleBaseCatalogRepository,
  ) {}

  public async execute(
    input: ReadAllRuleBasesRequestDto,
  ): Promise<RuleBaseCatalogItemResponseDto[]> {
    const bases: readonly RuleBaseCatalog[] =
      input.ruleTypeKey !== undefined
        ? await this.ruleBaseCatalogRepository.findAllByRuleTypeKey({
            ruleTypeKey: input.ruleTypeKey,
          })
        : await this.ruleBaseCatalogRepository.findAll();
    const data: RuleBaseCatalogItemResponseDto[] = bases.map(
      (row: RuleBaseCatalog) =>
        Object.assign(new RuleBaseCatalogItemResponseDto(), {
          id: row.id,
          name: row.name,
          key: row.key,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        }),
    );
    return data;
  }
}
