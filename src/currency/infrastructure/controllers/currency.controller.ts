import { Get, Controller } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import { CurrencyEntityDto } from '@currency/application/dtos/entity/currency-entity.dto';
import { ListCurrenciesUseCase } from '@currency/application/use-cases/list-currencies/list-currencies.use-case';

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
  @ApiOkResponse({ type: CurrencyEntityDto, isArray: true })
  public list(): Promise<CurrencyEntityDto[]> {
    return this.listCurrenciesUseCase.execute();
  }
}
