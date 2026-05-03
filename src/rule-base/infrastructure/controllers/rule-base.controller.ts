import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ReadAllRuleBasesQueryDto } from '@rule-base/application/dtos/read-all-rule-bases/read-all-rule-bases-query.dto';
import { ReadAllRuleBasesResponseDto } from '@rule-base/application/dtos/read-all-rule-bases/read-all-rule-bases-response.dto';
import { ReadAllRuleBasesUseCase } from '@rule-base/application/use-cases/read-all-rule-bases/read-all-rule-bases.use-case';

@ApiTags('rule-base')
@ApiBearerAuth('access-token')
@Controller('rule-base')
export class RuleBaseController {
  public constructor(
    private readonly readAllRuleBasesUseCase: ReadAllRuleBasesUseCase,
  ) {}

  @Get('read-all')
  @ApiOperation({
    summary:
      'List rule bases (evaluation criteria). Optional ruleTypeKey filters to allowed combinations.',
  })
  @ApiOkResponse({ type: ReadAllRuleBasesResponseDto })
  public readAll(
    @Query() query: ReadAllRuleBasesQueryDto,
  ): Promise<ReadAllRuleBasesResponseDto> {
    return this.readAllRuleBasesUseCase.execute(query);
  }
}
