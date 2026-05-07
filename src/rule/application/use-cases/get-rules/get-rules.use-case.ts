import { Inject, Injectable } from '@nestjs/common';

import { RULE_BASE_CATALOG_REPOSITORY } from '@rule-base/domain/rule-base-catalog-repository.token';

import { RULE_TYPE_CATALOG_REPOSITORY } from '@rule-type/domain/rule-type-catalog-repository.token';

import type { IRuleBaseCatalogRepository } from '@rule-base/domain/ports/i-rule-base-catalog-repository';

import type { IRuleTypeCatalogRepository } from '@rule-type/domain/ports/i-rule-type-catalog-repository';

import type { Rule } from '@rule/domain/entities/rule';
import { RULE_REPOSITORY } from '@rule/domain/rule-repository.token';
import { RuleToResourceMapper } from '@rule/application/mappers/rule-to-resource.mapper';
import type { IRuleRepository } from '@rule/domain/ports/i-rule-repository';
import { RuleResourceResponseDto } from '@rule/application/dtos/rule-resource/rule-resource-response.dto';
import type { GetRulesRequestDto } from '@rule/application/dtos/get-rules/get-rules-request.dto';

@Injectable()
export class GetRulesUseCase {
  public constructor(
    @Inject(RULE_REPOSITORY)
    private readonly ruleRepository: IRuleRepository,
    @Inject(RULE_TYPE_CATALOG_REPOSITORY)
    private readonly ruleTypeCatalogRepository: IRuleTypeCatalogRepository,
    @Inject(RULE_BASE_CATALOG_REPOSITORY)
    private readonly ruleBaseCatalogRepository: IRuleBaseCatalogRepository,
  ) {}

  public async execute(
    input: GetRulesRequestDto,
  ): Promise<RuleResourceResponseDto[]> {
    const rules: readonly Rule[] = await this.ruleRepository.findAllByUserId(
      input.userId,
    );
    const out: RuleResourceResponseDto[] = [];
    for (const rule of rules) {
      const type = await this.ruleTypeCatalogRepository.findById(
        rule.ruleTypeId,
      );
      const base = await this.ruleBaseCatalogRepository.findById(
        rule.ruleBaseId,
      );
      out.push(
        RuleToResourceMapper.toResource(
          rule,
          type?.key ?? 'unknown',
          base?.key ?? 'unknown',
        ),
      );
    }
    return out;
  }
}
