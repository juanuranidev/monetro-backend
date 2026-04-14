import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IAccountRepository } from '@account/domain/ports/interface-account-repository';
import { ACCOUNT_REPOSITORY } from '@account/domain/account-repository.token';
import type { ICategoryRepository } from '@category/domain/ports/i-category-repository';
import { CATEGORY_REPOSITORY } from '@category/domain/category-repository.token';
import { Rule } from '@rule/domain/entities/rule';
import { RULE_REPOSITORY } from '@rule/domain/rule-repository.token';
import type { IRuleRepository } from '@rule/domain/ports/i-rule-repository';
import type { CreateRuleRequestDto } from '@rule/application/dtos/request/create-rule-request.dto';
import { RuleEntityDto } from '@rule/application/dtos/entity/rule-entity.dto';

@Injectable()
export class CreateRuleUseCase {
  public constructor(
    @Inject(RULE_REPOSITORY)
    private readonly ruleRepository: IRuleRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
  ) {}

  public async execute(
    userId: string,
    input: CreateRuleRequestDto,
  ): Promise<RuleEntityDto> {
    const category = await this.categoryRepository.findAccessibleByUser(
      input.targetCategoryId,
      userId,
    );
    if (category === undefined) {
      throw new BadRequestException('Category not found or not accessible');
    }
    const account = await this.accountRepository.findOwnedByUser(
      input.targetAccountId,
      userId,
    );
    if (account === undefined) {
      throw new BadRequestException('Account not found for current user');
    }
    const rule: Rule = new Rule(
      randomUUID(),
      input.pattern.trim(),
      input.targetCategoryId,
      input.targetAccountId,
      userId,
    );
    const saved: Rule = await this.ruleRepository.create(rule);
    return new RuleEntityDto(
      saved.id,
      saved.pattern,
      saved.targetCategoryId,
      saved.targetAccountId,
    );
  }
}
