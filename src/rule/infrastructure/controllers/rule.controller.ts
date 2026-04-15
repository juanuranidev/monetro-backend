import {
  Get,
  Body,
  Post,
  HttpCode,
  Controller,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { MergeAuthenticatedUserIdInterceptor } from '@core/interceptors/merge-authenticated-user-id.interceptor';

import { CreateRuleUseCase } from '@rule/application/use-cases/create-rule/create-rule.use-case';
import { CreateRuleRequestDto } from '@rule/application/dtos/create-rule/create-rule-request.dto';
import { CreateRuleResponseDto } from '@rule/application/dtos/create-rule/create-rule-response.dto';

@ApiTags('rules')
@UseInterceptors(MergeAuthenticatedUserIdInterceptor)
@ApiBearerAuth('access-token')
@Controller('rules')
export class RuleController {
  public constructor(private readonly createRuleUseCase: CreateRuleUseCase) {}

  @Get('admin/test')
  @ApiOperation({ summary: 'Smoke test' })
  @ApiOkResponse({
    schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
  })
  public adminTest(): { readonly ok: boolean } {
    return { ok: true };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a categorization rule' })
  @ApiBody({ type: CreateRuleRequestDto })
  @ApiCreatedResponse({ type: CreateRuleResponseDto })
  public create(
    @Body() body: CreateRuleRequestDto,
  ): Promise<CreateRuleResponseDto> {
    return this.createRuleUseCase.execute(body);
  }
}
