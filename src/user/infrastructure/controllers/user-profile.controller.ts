import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { RequestUser } from '../../../core/strategies/jwt.strategy';
import { UserEntityDto } from '../../application/dtos/entity/user-entity.dto';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile/get-user-profile.use-case';
import { CurrentUser } from '../decorators/current-user.decorator';

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
  public getProfile(
    @CurrentUser() user: RequestUser,
  ): Promise<UserEntityDto> {
    return this.getUserProfileUseCase.execute(user.userId);
  }
}
