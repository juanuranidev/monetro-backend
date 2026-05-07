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

/** Read-only currency catalog; no per-user body (see {@link GetCurrenciesRequestDto} for future filters). */
@ApiTags('currencies')
@ApiBearerAuth('access-token')
@Controller('currencies')
export class CurrencyController {
  public constructor(
    private readonly getCurrenciesUseCase: GetCurrenciesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all currencies' })
  @ApiOkResponse({ type: GetCurrenciesResponseDto, isArray: true })
  public getCurrencies(): Promise<GetCurrenciesResponseDto[]> {
    return this.getCurrenciesUseCase.execute(new GetCurrenciesRequestDto());
  }
}
