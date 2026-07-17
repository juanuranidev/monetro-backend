import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { USER_REPOSITORY } from '@user/domain/user-repository.token';
import type { IUserRepository } from '@user/domain/ports/i-user-repository';
import { GetUserProfileResponseDto } from '@user/application/dtos/get-user-profile/get-user-profile-response.dto';
import type { GetUserProfileRequestDto } from '@user/application/dtos/get-user-profile/get-user-profile-request.dto';

@Injectable()
export class GetUserProfileUseCase {
  public constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(
    input: GetUserProfileRequestDto,
  ): Promise<GetUserProfileResponseDto> {
    const user = await this.userRepository.findById({ id: input.userId });

    if (user === undefined) {
      throw new NotFoundException('User not found');
    }

    return Object.assign(new GetUserProfileResponseDto(), {
      id: user.id,
      name: user.name,
      email: user.email,
      ...(user.image !== undefined ? { image: user.image } : {}),
    });
  }
}
