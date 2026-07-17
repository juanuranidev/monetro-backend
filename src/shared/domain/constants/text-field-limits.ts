/**
 * Shared varchar / validation lengths so TypeORM columns and DTOs stay aligned.
 */
export const TextFieldLimits = {
  shortLabel: 255,
  email: 320,
  ruleCatalogKey: 64,
  rulePattern: 512,
  transactionDescription: 1024,
  url: 2048,
  currencyKey: 3,
  currencySymbol: 8,
  currencyName: 128,
  transactionTypeKey: 32,

  /** Credit card catalog keys (brand / tier), similar to {@link ruleCatalogKey}. */
  creditCardCatalogKey: 64,

  /** Last six digits (PCI: never store full PAN). */
  creditCardLastSixDigits: 6,
} as const;
