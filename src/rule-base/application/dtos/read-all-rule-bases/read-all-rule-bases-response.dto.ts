import { ApiProperty } from '@nestjs/swagger';

import { RuleBaseCatalogItemResponseDto } from '@rule-base/application/dtos/read-all-rule-bases/rule-base-catalog-item-response.dto';

export class ReadAllRuleBasesResponseDto {
  @ApiProperty({ example: true })
  public success!: boolean;

  @ApiProperty({ example: 200 })
  public status!: number;

  @ApiProperty({ example: 'OK' })
  public message!: string;

  @ApiProperty({ type: [RuleBaseCatalogItemResponseDto] })
  public data!: RuleBaseCatalogItemResponseDto[];
}
