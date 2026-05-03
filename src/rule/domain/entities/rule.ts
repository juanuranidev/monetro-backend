export class Rule {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly ruleTypeId: string,
    public readonly ruleBaseId: string,
    public readonly pattern: string,
    public readonly sourceAccountId: string | undefined,
    public readonly sourceCategoryId: string | undefined,
    public readonly sourceTransactionTypeId: string | undefined,
    /** For categorization rules: categories to apply when the rule matches. */
    public readonly effectCategoryIds: readonly string[],
    /**
     * For exclusion rules: when a transaction matches, mark with excludeFromStats.
     * Ignored for other rule types (stored as false in DB for clarity).
     */
    public readonly excludesFromStats: boolean,
    public readonly userId: string,
  ) {}
}

export type RuleCreateData = Omit<InstanceType<typeof Rule>, 'id'>;
