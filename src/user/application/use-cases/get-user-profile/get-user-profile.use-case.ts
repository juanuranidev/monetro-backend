import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/ports/i-user-repository';
import { USER_REPOSITORY } from '../../../domain/user-repository.token';
import { UserProfileResponseDto } from '../../dtos/response/entity/user-profile-response.dto';

@Injectable()
export class GetUserProfileUseCase {
  public constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (user === undefined) {
      throw new NotFoundException('User not found');
    }
    return new UserProfileResponseDto(
      user.id,
      user.name,
      user.email,
      user.authId,
      user.image,
    );
  }
}
