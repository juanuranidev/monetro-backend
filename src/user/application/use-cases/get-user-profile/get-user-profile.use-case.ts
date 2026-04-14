import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '@user/domain/ports/i-user-repository';
import { USER_REPOSITORY } from '@user/domain/user-repository.token';
import { UserEntityDto } from '@user/application/dtos/entity/user-entity.dto';

@Injectable()
export class GetUserProfileUseCase {
  public constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(userId: string): Promise<UserEntityDto> {
    const user = await this.userRepository.findById(userId);
    if (user === undefined) {
      throw new NotFoundException('User not found');
    }
    return new UserEntityDto(
      user.id,
      user.name,
      user.email,
      user.authId,
      user.image,
    );
  }
}
