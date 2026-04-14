import { Get, Controller } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import type { RequestUser } from '@core/strategies/jwt.strategy';

import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';
import { UserEntityDto } from '@user/application/dtos/entity/user-entity.dto';
import { GetUserProfileUseCase } from '@user/application/use-cases/get-user-profile/get-user-profile.use-case';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserProfileController {
  public constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  @Get('admin/test')
  @ApiOperation({ summary: 'Smoke test' })
  @ApiOkResponse({
    schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
  })
  public adminTest(): { readonly ok: boolean } {
    return { ok: true };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiOkResponse({ type: UserEntityDto })
  public getProfile(@CurrentUser() user: RequestUser): Promise<UserEntityDto> {
    return this.getUserProfileUseCase.execute(user.userId);
  }
}
