# Rule type × rule base (validation matrix)

The API enforces the following in `assertRuleTypeBaseShape` (see `src/rule/application/validation/rule-input-validator.ts`).

| rule_type (key)   | rule_base (key)   | Match fields (non-null)     | Effect fields |
|-------------------|-------------------|-----------------------------|---------------|
| categorization    | keyword           | `pattern`                   | `effectCategoryIds` (≥1) |
| categorization    | account           | `sourceAccountId`           | `effectCategoryIds` (≥1) |
| categorization    | transaction_type  | `sourceTransactionTypeId`  | `effectCategoryIds` (≥1) |
| exclusion         | keyword           | `pattern`                   | `excludesFromStats` (default true on create) |
| exclusion         | category          | `sourceCategoryId`          | `excludesFromStats` |
| exclusion         | account           | `sourceAccountId`           | `excludesFromStats` |

Other columns must be empty for the chosen base (e.g. do not send `pattern` for non-keyword bases). Pairs not listed in `rule_type_bases` are rejected.
