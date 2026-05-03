import { ApiProperty } from '@nestjs/swagger';

import { RuleTypeCatalogItemResponseDto } from '@rule-type/application/dtos/read-all-rule-types/rule-type-catalog-item-response.dto';

export class ReadAllRuleTypesResponseDto {
  @ApiProperty({ example: true })
  public success!: boolean;

  @ApiProperty({ example: 200 })
  public status!: number;

  @ApiProperty({ example: 'OK' })
  public message!: string;

  @ApiProperty({ type: [RuleTypeCatalogItemResponseDto] })
  public data!: RuleTypeCatalogItemResponseDto[];
}
