import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Delete,
  HttpCode,
  Controller,
  HttpStatus,
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

import { GetRulesUseCase } from '@rule/application/use-cases/get-rules/get-rules.use-case';
import { CreateRuleUseCase } from '@rule/application/use-cases/create-rule/create-rule.use-case';
import { UpdateRuleUseCase } from '@rule/application/use-cases/update-rule/update-rule.use-case';
import { DeleteRuleUseCase } from '@rule/application/use-cases/delete-rule/delete-rule.use-case';
import { UpdateRuleBodyDto } from '@rule/application/dtos/update-rule/update-rule-body.dto';
import { CreateRuleBodyDto } from '@rule/application/dtos/create-rule/create-rule-body.dto';
import { GetRulesRequestDto } from '@rule/application/dtos/get-rules/get-rules-request.dto';
import { UpdateRuleRequestDto } from '@rule/application/dtos/update-rule/update-rule-request.dto';
import { DeleteRuleRequestDto } from '@rule/application/dtos/delete-rule/delete-rule-request.dto';
import { CreateRuleRequestDto } from '@rule/application/dtos/create-rule/create-rule-request.dto';
import { CreateRuleResponseDto } from '@rule/application/dtos/create-rule/create-rule-response.dto';
import { RuleResourceResponseDto } from '@rule/application/dtos/rule-resource/rule-resource-response.dto';

import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';

@ApiTags('rules')
@ApiBearerAuth('access-token')
@Controller('rules')
export class RuleController {
  public constructor(
    private readonly createRuleUseCase: CreateRuleUseCase,
    private readonly getRulesUseCase: GetRulesUseCase,
    private readonly updateRuleUseCase: UpdateRuleUseCase,
    private readonly deleteRuleUseCase: DeleteRuleUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List rules for the current user' })
  @ApiOkResponse({ type: RuleResourceResponseDto, isArray: true })
  public getRules(
    @CurrentUser() user: RequestUser,
  ): Promise<RuleResourceResponseDto[]> {
    return this.getRulesUseCase.execute(
      Object.assign(new GetRulesRequestDto(), { userId: user.userId }),
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a rule' })
  @ApiBody({ type: CreateRuleBodyDto })
  @ApiCreatedResponse({ type: CreateRuleResponseDto })
  public create(
    @CurrentUser() user: RequestUser,
    @Body() body: CreateRuleBodyDto,
  ): Promise<CreateRuleResponseDto> {
    return this.createRuleUseCase.execute(
      CreateRuleRequestDto.fromBody(body, user.userId),
    );
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
    return this.updateRuleUseCase.execute(
      Object.assign(new UpdateRuleRequestDto(), {
        ruleId,
        userId: user.userId,
        body,
      }),
    );
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
    await this.deleteRuleUseCase.execute(
      Object.assign(new DeleteRuleRequestDto(), {
        ruleId,
        userId: user.userId,
      }),
    );
  }
}
