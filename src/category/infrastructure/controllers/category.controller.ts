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
import { CreateCategoryRequestDto } from '@category/application/dtos/create-category/create-category-request.dto';
import { CreateCategoryResponseDto } from '@category/application/dtos/create-category/create-category-response.dto';

import { MergeAuthenticatedUserIdInterceptor } from '@core/interceptors/merge-authenticated-user-id.interceptor';

@ApiTags('categories')
@UseInterceptors(MergeAuthenticatedUserIdInterceptor)
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
  @ApiCreatedResponse({ type: CreateCategoryResponseDto })
  public create(
    @Body() body: CreateCategoryRequestDto,
  ): Promise<CreateCategoryResponseDto> {
    return this.createCategoryUseCase.execute(body);
  }
}
