import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Post, HttpCode, Controller, HttpStatus } from '@nestjs/common';

import { PublicRoute } from '@core/decorators/public-route.decorator';

import { RunCatalogSeedUseCase } from '@database/application/use-cases/run-catalog-seed/run-catalog-seed.use-case';
import { RunCatalogSeedRequestDto } from '@database/application/dtos/run-catalog-seed/run-catalog-seed-request.dto';
import { RunCatalogSeedResponseDto } from '@database/application/dtos/run-catalog-seed/run-catalog-seed-response.dto';

/**
 * HTTP trigger for catalog seed (currencies, transaction types, rule types/bases/pivot).
 */
@ApiTags('database')
@Controller('database')
export class DatabaseSeedController {
  public constructor(
    private readonly runCatalogSeedUseCase: RunCatalogSeedUseCase,
  ) {}

  @PublicRoute()
  @Post('seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Run catalog seed (currencies, transaction types, rule catalogs)',
    description:
      'Call after migrations on empty DB when needed. Idempotent: skips work if rows already exist.',
  })
  @ApiOkResponse({ type: RunCatalogSeedResponseDto })
  public seed(): Promise<RunCatalogSeedResponseDto> {
    return this.runCatalogSeedUseCase.execute(new RunCatalogSeedRequestDto());
  }
}
