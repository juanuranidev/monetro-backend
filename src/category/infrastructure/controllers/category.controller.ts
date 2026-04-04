import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { RequestUser } from '../../../core/strategies/jwt.strategy';
import { CurrentUser } from '../../../user/infrastructure/decorators/current-user.decorator';
import { CreateCategoryRequestDto } from '../../application/dtos/request/create-category-request.dto';
import { CategoryResponseDto } from '../../application/dtos/response/entity/category-response.dto';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category/create-category.use-case';

@ApiTags('categories')
@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoryController {
  public constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
  ) {}

  @Get('admin/test')
  @ApiOperation({ summary: 'Smoke test' })
  @ApiOkResponse({
    schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
  })
  public adminTest(): { readonly ok: boolean } {
    return { ok: true };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a category for the current user' })
  @ApiBody({ type: CreateCategoryRequestDto })
  @ApiCreatedResponse({ type: CategoryResponseDto })
  public create(
    @CurrentUser() user: RequestUser,
    @Body() body: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return this.createCategoryUseCase.execute(user.userId, body);
  }
}
