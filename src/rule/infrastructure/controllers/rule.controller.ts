import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { RequestUser } from '@core/strategies/jwt.strategy';
import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';
import { CreateRuleRequestDto } from '@rule/application/dtos/request/create-rule-request.dto';
import { RuleEntityDto } from '@rule/application/dtos/entity/rule-entity.dto';
import { CreateRuleUseCase } from '@rule/application/use-cases/create-rule/create-rule.use-case';

@ApiTags('rules')
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
  @ApiCreatedResponse({ type: RuleEntityDto })
  public create(
    @CurrentUser() user: RequestUser,
    @Body() body: CreateRuleRequestDto,
  ): Promise<RuleEntityDto> {
    return this.createRuleUseCase.execute(user.userId, body);
  }
}
