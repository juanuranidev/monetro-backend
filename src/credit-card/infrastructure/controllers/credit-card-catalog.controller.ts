import { Get, Controller } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ReadAllCreditCardTiersUseCase } from '@credit-card/application/use-cases/read-all-credit-card-tiers/read-all-credit-card-tiers.use-case';

import { ReadAllCreditCardBrandsUseCase } from '@credit-card/application/use-cases/read-all-credit-card-brands/read-all-credit-card-brands.use-case';

import { CreditCardCatalogItemResponseDto } from '@credit-card/application/dtos/read-all-credit-card-brands/credit-card-catalog-item-response.dto';

import { ReadAllCreditCardTiersRequestDto } from '@credit-card/application/dtos/read-all-credit-card-tiers/read-all-credit-card-tiers-request.dto';

import { ReadAllCreditCardBrandsRequestDto } from '@credit-card/application/dtos/read-all-credit-card-brands/read-all-credit-card-brands-request.dto';

@ApiTags('credit-card-catalog')
@ApiBearerAuth('access-token')
@Controller()
export class CreditCardCatalogController {
  public constructor(
    private readonly readBrandsUseCase: ReadAllCreditCardBrandsUseCase,
    private readonly readTiersUseCase: ReadAllCreditCardTiersUseCase,
  ) {}

  @Get('credit-card-brand/read-all')
  @ApiOperation({ summary: 'List all credit card brands (catalog)' })
  @ApiOkResponse({
    type: CreditCardCatalogItemResponseDto,
    isArray: true,
    description: 'Brand keys usable in POST/PATCH payloads',
  })
  public async readAllBrands(): Promise<CreditCardCatalogItemResponseDto[]> {
    const result = await this.readBrandsUseCase.execute(
      new ReadAllCreditCardBrandsRequestDto(),
    );
    return result.items;
  }

  @Get('credit-card-tier/read-all')
  @ApiOperation({ summary: 'List all credit card tiers/types (catalog)' })
  @ApiOkResponse({
    type: CreditCardCatalogItemResponseDto,
    isArray: true,
    description: 'Tier/type keys usable in POST/PATCH payloads',
  })
  public async readAllTiers(): Promise<CreditCardCatalogItemResponseDto[]> {
    const result = await this.readTiersUseCase.execute(
      new ReadAllCreditCardTiersRequestDto(),
    );
    return result.items;
  }
}
