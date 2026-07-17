export interface TransactionFindAllByUserIdData {
  readonly userId: string;

  readonly accountId?: string;

  /** When set (alone), list only transactions whose posting leg is this card id. Mutually exclusive with accountId filtering in the use case. */
  readonly creditCardId?: string;
}
