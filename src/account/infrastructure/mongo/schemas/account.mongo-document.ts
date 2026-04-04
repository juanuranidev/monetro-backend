/**
 * Shape of an Account document as stored in MongoDB (BSON).
 * With @nestjs/mongoose you would mirror this with @Schema() / @Prop().
 *
 * Example (not active — install mongoose + @nestjs/mongoose):
 *
 * @Schema({ collection: 'accounts' })
 * export class AccountMongoSchema {
 *   @Prop({ required: true })
 *   name: string;
 *   ...
 * }
 */
export type AccountMongoDocument = {
  readonly _id: string;
  readonly name: string;
  readonly identifier: string;
  readonly icon: string | null;
  readonly excludeFromStats: boolean;
  readonly currencyId: string;
  readonly userId: string;
};
