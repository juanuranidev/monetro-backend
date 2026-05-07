import emojiRegex from 'emoji-regex';

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

function isOnlyEmojiUnicodeContent(value: string): boolean {
  const trimmed: string = value.trim();
  if (trimmed.length === 0) {
    return false;
  }
  const re: RegExp = emojiRegex();
  let remaining: string = trimmed;
  while (remaining.length > 0) {
    re.lastIndex = 0;
    const match: RegExpExecArray | null = re.exec(remaining);
    if (match === null || match.index !== 0) {
      return false;
    }
    remaining = remaining.slice(match[0].length);
  }
  return true;
}

@ValidatorConstraint({ name: 'isEmojiUnicodeOnly', async: false })
class IsEmojiUnicodeOnlyConstraint implements ValidatorConstraintInterface {
  public validate(
    value: unknown,
    validationArguments: ValidationArguments,
  ): boolean {
    void validationArguments;
    if (value === undefined || value === null) {
      return true;
    }
    if (typeof value !== 'string') {
      return false;
    }
    return isOnlyEmojiUnicodeContent(value);
  }

  public defaultMessage(): string {
    return 'icon must contain only Unicode emoji (no text or icon keys such as cart)';
  }
}

/**
 * When applied, value must be non-empty Unicode emoji only (used for required or optional fields).
 */
export function IsEmojiUnicodeOnly(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyKey as string,
      options: validationOptions,
      constraints: [],
      validator: IsEmojiUnicodeOnlyConstraint,
    });
  };
}
