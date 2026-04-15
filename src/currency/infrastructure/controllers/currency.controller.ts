import { Get, Controller } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import { GetCurrenciesUseCase } from '@currency/application/use-cases/get-currencies/get-currencies.use-case';
import { GetCurrenciesRequestDto } from '@currency/application/dtos/get-currencies/get-currencies-request.dto';
import { GetCurrenciesResponseDto } from '@currency/application/dtos/get-currencies/get-currencies-response.dto';

@ApiTags('currencies')
@ApiBearerAuth('access-token')
@Controller('currencies')
export class CurrencyController {
  public constructor(
    private readonly getCurrenciesUseCase: GetCurrenciesUseCase,
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
  @ApiOperation({ summary: 'Get all currencies' })
  @ApiOkResponse({ type: GetCurrenciesResponseDto, isArray: true })
  public getCurrencies(): Promise<GetCurrenciesResponseDto[]> {
    const input: GetCurrenciesRequestDto = new GetCurrenciesRequestDto();
    return this.getCurrenciesUseCase.execute(input);
  }
}
