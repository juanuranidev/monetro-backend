/**
 * Slug values stored in `rule_types.key` / `rule_bases.key` (seed, lowercase).
 */
export const RuleTypeKey = {
  categorization: 'categorization',
  exclusion: 'exclusion',
} as const;

export const RuleBaseKey = {
  keyword: 'keyword',
  account: 'account',
  category: 'category',
  transaction_type: 'transaction_type',
} as const;

export type RuleTypeKeyValue =
  (typeof RuleTypeKey)[keyof typeof RuleTypeKey];
export type RuleBaseKeyValue =
  (typeof RuleBaseKey)[keyof typeof RuleBaseKey];
