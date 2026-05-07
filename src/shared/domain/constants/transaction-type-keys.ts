/** Lowercase keys stored in `transaction_types.key` (seed and API). */
export const TransactionTypeKey = {
  income: 'income',
  expense: 'expense',
} as const;

export type TransactionTypeKeyValue =
  (typeof TransactionTypeKey)[keyof typeof TransactionTypeKey];
