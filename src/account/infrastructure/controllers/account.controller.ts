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
import type { RequestUser } from '../../../core/strategies/jwt.strategy';
import { CurrentUser } from '../../../user/infrastructure/decorators/current-user.decorator';
import { CreateAccountRequestDto } from '../../application/dtos/request/create-account-request.dto';
import { AccountEntityDto } from '../../application/dtos/entity/account-entity.dto';
import { CreateAccountUseCase } from '../../application/use-cases/create-account/create-account.use-case';

@ApiTags('accounts')
@ApiBearerAuth('access-token')
@Controller('accounts')
export class AccountController {
  public constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
  ) {}

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
  @ApiOperation({ summary: 'Create a new account for the current user' })
  @ApiBody({ type: CreateAccountRequestDto })
  @ApiCreatedResponse({ type: AccountEntityDto })
  public create(
    @CurrentUser() user: RequestUser,
    @Body() body: CreateAccountRequestDto,
  ): Promise<AccountEntityDto> {
    return this.createAccountUseCase.execute(user.userId, body);
  }
}
