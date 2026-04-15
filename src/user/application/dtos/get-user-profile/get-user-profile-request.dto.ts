import { IsUUID } from 'class-validator';

/**
 * Input for {@link GetUserProfileUseCase} (caller supplies the authenticated user id).
 */
export class GetUserProfileRequestDto {
  @IsUUID()
  public userId!: string;
}
