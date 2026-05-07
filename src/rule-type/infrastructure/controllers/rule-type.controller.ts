import { Get, Controller } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ReadAllRuleTypesUseCase } from '@rule-type/application/use-cases/read-all-rule-types/read-all-rule-types.use-case';

import { ReadAllRuleTypesRequestDto } from '@rule-type/application/dtos/read-all-rule-types/read-all-rule-types-request.dto';

import { ReadAllRuleTypesResponseDto } from '@rule-type/application/dtos/read-all-rule-types/read-all-rule-types-response.dto';

/** Read-only rule-type catalog; no query/body ({@link ReadAllRuleTypesRequestDto} reserved for future filters). */
@ApiTags('rule-type')
@ApiBearerAuth('access-token')
@Controller('rule-type')
export class RuleTypeController {
  public constructor(
    private readonly readAllRuleTypesUseCase: ReadAllRuleTypesUseCase,
  ) {}

  @Get('read-all')
  @ApiOperation({ summary: 'List all rule types (intentions)' })
  @ApiOkResponse({ type: ReadAllRuleTypesResponseDto })
  public readAll(): Promise<ReadAllRuleTypesResponseDto> {
    return this.readAllRuleTypesUseCase.execute(
      new ReadAllRuleTypesRequestDto(),
    );
  }
}
