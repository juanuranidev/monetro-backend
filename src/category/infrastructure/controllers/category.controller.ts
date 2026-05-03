import {
  Get,
  Body,
  Post,
  HttpCode,
  Controller,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { CreateCategoryUseCase } from '@category/application/use-cases/create-category/create-category.use-case';
import { GetCategoriesUseCase } from '@category/application/use-cases/get-categories/get-categories.use-case';
import { CreateCategoryRequestDto } from '@category/application/dtos/create-category/create-category-request.dto';
import { CreateCategoryResponseDto } from '@category/application/dtos/create-category/create-category-response.dto';
import { GetCategoriesRequestDto } from '@category/application/dtos/get-categories/get-categories-request.dto';
import { GetCategoriesResponseDto } from '@category/application/dtos/get-categories/get-categories-response.dto';

import type { RequestUser } from '@core/strategies/jwt.strategy';
import { MergeAuthenticatedUserIdInterceptor } from '@core/interceptors/merge-authenticated-user-id.interceptor';
import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';

@ApiTags('categories')
@UseInterceptors(MergeAuthenticatedUserIdInterceptor)
@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoryController {
  public constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
  ) {}

  @Get('admin/test')
  @ApiOperation({ summary: 'Smoke test' })
  @ApiOkResponse({
    schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
  })
  public adminTest(): { readonly ok: boolean } {
    return { ok: true };
  }

  @Get()
  @ApiOperation({
    summary: 'List categories (defaults and categories for the current user)',
  })
  @ApiOkResponse({ type: GetCategoriesResponseDto, isArray: true })
  public getCategories(
    @CurrentUser() user: RequestUser,
  ): Promise<GetCategoriesResponseDto[]> {
    const input: GetCategoriesRequestDto = new GetCategoriesRequestDto();
    input.userId = user.userId;
    return this.getCategoriesUseCase.execute(input);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a category for the current user' })
  @ApiBody({ type: CreateCategoryRequestDto })
  @ApiCreatedResponse({ type: CreateCategoryResponseDto })
  public create(
    @Body() body: CreateCategoryRequestDto,
  ): Promise<CreateCategoryResponseDto> {
    return this.createCategoryUseCase.execute(body);
  }
}
