import { ApiProperty } from '@nestjs/swagger';

import { CreditCardCatalogItemResponseDto } from '@credit-card/application/dtos/read-all-credit-card-brands/credit-card-catalog-item-response.dto';

export class ReadAllCreditCardBrandsResponseDto {
  @ApiProperty({
    type: [CreditCardCatalogItemResponseDto],
  })
  public items!: CreditCardCatalogItemResponseDto[];
}
