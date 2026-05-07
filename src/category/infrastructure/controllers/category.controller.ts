import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Delete,
  HttpCode,
  Controller,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import { GetCategoriesUseCase } from '@category/application/use-cases/get-categories/get-categories.use-case';
import { CreateCategoryUseCase } from '@category/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@category/application/use-cases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '@category/application/use-cases/delete-category/delete-category.use-case';
import { CreateCategoryBodyDto } from '@category/application/dtos/create-category/create-category-body.dto';
import { UpdateCategoryBodyDto } from '@category/application/dtos/update-category/update-category-body.dto';
import { GetCategoriesRequestDto } from '@category/application/dtos/get-categories/get-categories-request.dto';
import { CreateCategoryRequestDto } from '@category/application/dtos/create-category/create-category-request.dto';
import { UpdateCategoryRequestDto } from '@category/application/dtos/update-category/update-category-request.dto';
import { DeleteCategoryRequestDto } from '@category/application/dtos/delete-category/delete-category-request.dto';
import { GetCategoriesResponseDto } from '@category/application/dtos/get-categories/get-categories-response.dto';
import { CreateCategoryResponseDto } from '@category/application/dtos/create-category/create-category-response.dto';
import { UpdateCategoryResponseDto } from '@category/application/dtos/update-category/update-category-response.dto';

import type { RequestUser } from '@core/strategies/jwt.strategy';

import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';

@ApiTags('categories')
@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoryController {
  public constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List categories for the current user',
  })
  @ApiOkResponse({ type: GetCategoriesResponseDto, isArray: true })
  public getCategories(
    @CurrentUser() user: RequestUser,
  ): Promise<GetCategoriesResponseDto[]> {
    return this.getCategoriesUseCase.execute(
      Object.assign(new GetCategoriesRequestDto(), { userId: user.userId }),
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a category for the current user' })
  @ApiBody({ type: CreateCategoryBodyDto })
  @ApiCreatedResponse({ type: CreateCategoryResponseDto })
  public create(
    @CurrentUser() user: RequestUser,
    @Body() body: CreateCategoryBodyDto,
  ): Promise<CreateCategoryResponseDto> {
    return this.createCategoryUseCase.execute(
      CreateCategoryRequestDto.fromBody(body, user.userId),
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a category (current user only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateCategoryBodyDto })
  @ApiOkResponse({ type: UpdateCategoryResponseDto })
  public update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) categoryId: string,
    @CurrentUser() user: RequestUser,
    @Body() body: UpdateCategoryBodyDto,
  ): Promise<UpdateCategoryResponseDto> {
    return this.updateCategoryUseCase.execute(
      Object.assign(new UpdateCategoryRequestDto(), {
        categoryId,
        userId: user.userId,
        body,
      }),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a category (current user only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse()
  public async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) categoryId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    await this.deleteCategoryUseCase.execute(
      Object.assign(new DeleteCategoryRequestDto(), {
        categoryId,
        userId: user.userId,
      }),
    );
  }
}
