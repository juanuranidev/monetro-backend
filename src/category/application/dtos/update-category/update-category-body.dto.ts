import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import { IsString, MinLength, IsOptional, ValidateIf } from 'class-validator';

import { IsEmojiUnicodeOnly } from '@category/application/validation/is-emoji-unicode-only.decorator';

/** Partial body for PATCH /categories/:id (user id comes from JWT, not the payload). */
export class UpdateCategoryBodyDto {
  @ApiPropertyOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed: string = value.trim();
    return trimmed === '' ? undefined : trimmed;
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  public name?: string;

  @ApiPropertyOptional({
    description:
      'Unicode emoji only. Omit to leave unchanged; empty or whitespace-only values are rejected.',
    example: '🛒',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (typeof value !== 'string') {
      return value;
    }
    return value.trim();
  })
  @IsOptional()
  @ValidateIf((_, v: unknown) => v !== undefined && v !== null)
  @IsString()
  @MinLength(1)
  @IsEmojiUnicodeOnly()
  public icon?: string;
}
