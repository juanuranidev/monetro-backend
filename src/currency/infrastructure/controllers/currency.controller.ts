import { Get, Controller } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ListCurrenciesUseCase } from '@currency/application/use-cases/list-currencies/list-currencies.use-case';
import { ListCurrenciesResultDto } from '@currency/application/dtos/list-currencies/list-currencies-response.dto';
import { ListCurrenciesRequestDto } from '@currency/application/dtos/list-currencies/list-currencies-request.dto';

@ApiTags('currencies')
@ApiBearerAuth('access-token')
@Controller('currencies')
export class CurrencyController {
  public constructor(
    private readonly listCurrenciesUseCase: ListCurrenciesUseCase,
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
  @ApiOperation({ summary: 'List all currencies' })
  @ApiOkResponse({ type: ListCurrenciesResultDto, isArray: true })
  public list(): Promise<ListCurrenciesResultDto[]> {
    const input: ListCurrenciesRequestDto = new ListCurrenciesRequestDto();
    return this.listCurrenciesUseCase.execute(input);
  }
}
