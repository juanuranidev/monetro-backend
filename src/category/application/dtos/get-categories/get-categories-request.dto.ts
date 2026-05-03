import { IsUUID } from 'class-validator';

/**
 * Input for {@link GetCategoriesUseCase} (caller supplies the authenticated user id).
 */
export class GetCategoriesRequestDto {
  @IsUUID()
  public userId!: string;
}
