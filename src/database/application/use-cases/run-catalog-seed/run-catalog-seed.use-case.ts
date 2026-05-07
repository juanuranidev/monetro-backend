import { Injectable } from '@nestjs/common';

import { DatabaseSeedService } from '@database/database-seed.service';
import { RunCatalogSeedResponseDto } from '@database/application/dtos/run-catalog-seed/run-catalog-seed-response.dto';
import type { RunCatalogSeedRequestDto } from '@database/application/dtos/run-catalog-seed/run-catalog-seed-request.dto';

@Injectable()
export class RunCatalogSeedUseCase {
  public constructor(
    private readonly databaseSeedService: DatabaseSeedService,
  ) {}

  public async execute(
    _input: RunCatalogSeedRequestDto,
  ): Promise<RunCatalogSeedResponseDto> {
    void _input;
    await this.databaseSeedService.runCatalogSeeds();
    return Object.assign(new RunCatalogSeedResponseDto(), { ok: true });
  }
}
