import { Inject, Injectable } from '@nestjs/common';

import { RuleBaseCatalogItemResponseDto } from '@rule-base/application/dtos/read-all-rule-bases/rule-base-catalog-item-response.dto';
import { ReadAllRuleBasesResponseDto } from '@rule-base/application/dtos/read-all-rule-bases/read-all-rule-bases-response.dto';
import { RULE_BASE_CATALOG_REPOSITORY } from '@rule-base/domain/rule-base-catalog-repository.token';
import type { RuleBaseCatalog } from '@rule-base/domain/entities/rule-base-catalog';
import type { IRuleBaseCatalogRepository } from '@rule-base/domain/ports/i-rule-base-catalog-repository';
import type { ReadAllRuleBasesQueryDto } from '@rule-base/application/dtos/read-all-rule-bases/read-all-rule-bases-query.dto';

@Injectable()
export class ReadAllRuleBasesUseCase {
  public constructor(
    @Inject(RULE_BASE_CATALOG_REPOSITORY)
    private readonly ruleBaseCatalogRepository: IRuleBaseCatalogRepository,
  ) {}

  public async execute(
    query: ReadAllRuleBasesQueryDto,
  ): Promise<ReadAllRuleBasesResponseDto> {
    const bases: readonly RuleBaseCatalog[] =
      query.ruleTypeKey !== undefined
        ? await this.ruleBaseCatalogRepository.findAllByRuleTypeKey(
            query.ruleTypeKey,
          )
        : await this.ruleBaseCatalogRepository.findAll();
    const data: RuleBaseCatalogItemResponseDto[] = bases.map(
      (row: RuleBaseCatalog) => {
        const item: RuleBaseCatalogItemResponseDto =
          new RuleBaseCatalogItemResponseDto();
        item.id = row.id;
        item.name = row.name;
        item.key = row.key;
        item.createdAt = row.createdAt.toISOString();
        item.updatedAt = row.updatedAt.toISOString();
        return item;
      },
    );
    const response: ReadAllRuleBasesResponseDto =
      new ReadAllRuleBasesResponseDto();
    response.success = true;
    response.status = 200;
    response.message = 'OK';
    response.data = data;
    return response;
  }
}
