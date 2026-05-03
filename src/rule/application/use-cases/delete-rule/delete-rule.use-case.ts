import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { RULE_REPOSITORY } from '@rule/domain/rule-repository.token';
import type { IRuleRepository } from '@rule/domain/ports/i-rule-repository';

@Injectable()
export class DeleteRuleUseCase {
  public constructor(
    @Inject(RULE_REPOSITORY)
    private readonly ruleRepository: IRuleRepository,
  ) {}

  public async execute(params: {
    readonly ruleId: string;
    readonly userId: string;
  }): Promise<void> {
    const existing = await this.ruleRepository.findOwnedByUser(
      params.ruleId,
      params.userId,
    );
    if (existing === undefined) {
      throw new NotFoundException('Rule not found');
    }
    await this.ruleRepository.deleteOwned(params.ruleId, params.userId);
  }
}
