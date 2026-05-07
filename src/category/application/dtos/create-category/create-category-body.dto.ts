import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import { IsString, MinLength } from 'class-validator';

import { IsEmojiUnicodeOnly } from '@category/application/validation/is-emoji-unicode-only.decorator';

/** HTTP body for POST /categories (user id comes from JWT, not the payload). */
export class CreateCategoryBodyDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public name!: string;

  @ApiProperty({
    description:
      'Display glyph: Unicode emoji only (e.g. 🛒). Plain-text icon keys like "cart" are rejected.',
    example: '🛒',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null) {
      return value;
    }
    if (typeof value !== 'string') {
      return value;
    }
    return value.trim();
  })
  @IsString()
  @MinLength(1)
  @IsEmojiUnicodeOnly()
  public icon!: string;
}
