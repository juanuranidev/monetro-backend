import {
  Get,
  Body,
  Post,
  Patch,
  Delete,
  Param,
  HttpCode,
  Controller,
  HttpStatus,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import type { RequestUser } from '@core/strategies/jwt.strategy';
import { MergeAuthenticatedUserIdInterceptor } from '@core/interceptors/merge-authenticated-user-id.interceptor';
import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';

import { CreateRuleUseCase } from '@rule/application/use-cases/create-rule/create-rule.use-case';
import { GetRulesUseCase } from '@rule/application/use-cases/get-rules/get-rules.use-case';
import { UpdateRuleUseCase } from '@rule/application/use-cases/update-rule/update-rule.use-case';
import { DeleteRuleUseCase } from '@rule/application/use-cases/delete-rule/delete-rule.use-case';
import { CreateRuleRequestDto } from '@rule/application/dtos/create-rule/create-rule-request.dto';
import { CreateRuleResponseDto } from '@rule/application/dtos/create-rule/create-rule-response.dto';
import { GetRulesRequestDto } from '@rule/application/dtos/get-rules/get-rules-request.dto';
import { UpdateRuleBodyDto } from '@rule/application/dtos/update-rule/update-rule-body.dto';
import { RuleResourceResponseDto } from '@rule/application/dtos/rule-resource/rule-resource-response.dto';

@ApiTags('rules')
@UseInterceptors(MergeAuthenticatedUserIdInterceptor)
@ApiBearerAuth('access-token')
@Controller('rules')
export class RuleController {
  public constructor(
    private readonly createRuleUseCase: CreateRuleUseCase,
    private readonly getRulesUseCase: GetRulesUseCase,
    private readonly updateRuleUseCase: UpdateRuleUseCase,
    private readonly deleteRuleUseCase: DeleteRuleUseCase,
  ) {}

  @Get('admin/test')
  @ApiOperation({ summary: 'Smoke test' })
  @ApiOkResponse({
    schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
  })
  public adminTest(): { readonly ok: boolean } {
    return { ok: true };
  }

  @Get()
  @ApiOperation({ summary: 'List rules for the current user' })
  @ApiOkResponse({ type: RuleResourceResponseDto, isArray: true })
  public getRules(
    @CurrentUser() user: RequestUser,
  ): Promise<RuleResourceResponseDto[]> {
    const input: GetRulesRequestDto = new GetRulesRequestDto();
    input.userId = user.userId;
    return this.getRulesUseCase.execute(input);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a rule' })
  @ApiBody({ type: CreateRuleRequestDto })
  @ApiCreatedResponse({ type: CreateRuleResponseDto })
  public create(
    @Body() body: CreateRuleRequestDto,
  ): Promise<CreateRuleResponseDto> {
    return this.createRuleUseCase.execute(body);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a rule (current user only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateRuleBodyDto })
  @ApiOkResponse({ type: RuleResourceResponseDto })
  public updateRule(
    @Param('id', new ParseUUIDPipe({ version: '4' })) ruleId: string,
    @CurrentUser() user: RequestUser,
    @Body() body: UpdateRuleBodyDto,
  ): Promise<RuleResourceResponseDto> {
    return this.updateRuleUseCase.execute({
      ruleId,
      userId: user.userId,
      body,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a rule (current user only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse()
  public async deleteRule(
    @Param('id', new ParseUUIDPipe({ version: '4' })) ruleId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    await this.deleteRuleUseCase.execute({ ruleId, userId: user.userId });
  }
}
