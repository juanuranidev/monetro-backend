import Decimal from 'decimal.js';

const MONEY_DECIMAL_PLACES = 2 as const;
const MAX_INTEGER_DIGITS = 8 as const;

/**
 * Immutable monetary value using decimal arithmetic to avoid floating-point errors.
 */
export class MoneyAmount {
  private readonly value: Decimal;

  private constructor(value: Decimal) {
    this.value = value;
  }

  /**
   * Parses a decimal string (e.g. "-12.349" or "123.4") into a money amount:
   * fractional digits beyond scale 2 are truncated toward zero (ROUND_DOWN).
   */
  public static fromString(raw: string): MoneyAmount {
    const trimmed: string = raw.trim();
    if (trimmed.length === 0) {
      throw new Error('Money amount cannot be empty');
    }
    let parsed: Decimal;
    try {
      parsed = new Decimal(trimmed);
    } catch {
      throw new Error('Invalid money amount');
    }
    if (!parsed.isFinite()) {
      throw new Error('Invalid money amount');
    }
    const withScale: Decimal = parsed.toDecimalPlaces(
      MONEY_DECIMAL_PLACES,
      Decimal.ROUND_DOWN,
    );
    const integerPart: string = withScale.abs().trunc().toFixed(0);
    if (integerPart.length > MAX_INTEGER_DIGITS) {
      throw new Error('Money amount exceeds allowed precision');
    }
    return new MoneyAmount(withScale);
  }

  /**
   * Returns a fixed two-decimal string suitable for persistence (decimal 10,2).
   */
  public toPersistenceString(): string {
    return this.value.toFixed(MONEY_DECIMAL_PLACES);
  }

  /**
   * Exposes the decimal value for domain logic (read-only semantics).
   */
  public toDecimal(): Decimal {
    return this.value;
  }
}
