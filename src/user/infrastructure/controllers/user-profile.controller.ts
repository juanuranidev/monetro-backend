import { Get, Controller } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import type { RequestUser } from '@core/strategies/jwt.strategy';

import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';
import { GetUserProfileUseCase } from '@user/application/use-cases/get-user-profile/get-user-profile.use-case';
import { GetUserProfileRequestDto } from '@user/application/dtos/get-user-profile/get-user-profile-request.dto';
import { GetUserProfileResponseDto } from '@user/application/dtos/get-user-profile/get-user-profile-response.dto';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserProfileController {
  public constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiOkResponse({ type: GetUserProfileResponseDto })
  public getProfile(
    @CurrentUser() user: RequestUser,
  ): Promise<GetUserProfileResponseDto> {
    return this.getUserProfileUseCase.execute(
      Object.assign(new GetUserProfileRequestDto(), { userId: user.userId }),
    );
  }
}
