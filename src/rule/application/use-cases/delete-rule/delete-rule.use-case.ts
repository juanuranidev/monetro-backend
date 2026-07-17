import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { RULE_REPOSITORY } from '@rule/domain/rule-repository.token';
import type { IRuleRepository } from '@rule/domain/ports/i-rule-repository';
import { DeleteRuleResponseDto } from '@rule/application/dtos/delete-rule/delete-rule-response.dto';
import type { DeleteRuleRequestDto } from '@rule/application/dtos/delete-rule/delete-rule-request.dto';

@Injectable()
export class DeleteRuleUseCase {
  public constructor(
    @Inject(RULE_REPOSITORY)
    private readonly ruleRepository: IRuleRepository,
  ) {}

  public async execute(
    input: DeleteRuleRequestDto,
  ): Promise<DeleteRuleResponseDto> {
    const existing = await this.ruleRepository.findOwnedByUser({
      ruleId: input.ruleId,
      userId: input.userId,
    });
    if (existing === undefined) {
      throw new NotFoundException('Rule not found');
    }
    await this.ruleRepository.deleteOwned({
      ruleId: input.ruleId,
      userId: input.userId,
    });
    return Object.assign(new DeleteRuleResponseDto(), {});
  }
}
