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
  NotFoundException,
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

import { GetCreditCardUseCase } from '@credit-card/application/use-cases/get-credit-card/get-credit-card.use-case';

import { ListCreditCardsUseCase } from '@credit-card/application/use-cases/list-credit-cards/list-credit-cards.use-case';

import { CreateCreditCardBodyDto } from '@credit-card/application/dtos/create-credit-card/create-credit-card-body.dto';

import { UpdateCreditCardBodyDto } from '@credit-card/application/dtos/update-credit-card/update-credit-card-body.dto';

import { CreateCreditCardUseCase } from '@credit-card/application/use-cases/create-credit-card/create-credit-card.use-case';

import { DeleteCreditCardUseCase } from '@credit-card/application/use-cases/delete-credit-card/delete-credit-card.use-case';

import { UpdateCreditCardUseCase } from '@credit-card/application/use-cases/update-credit-card/update-credit-card.use-case';

import { ListCreditCardsRequestDto } from '@credit-card/application/dtos/list-credit-cards/list-credit-cards-request.dto';

import { CreateCreditCardRequestDto } from '@credit-card/application/dtos/create-credit-card/create-credit-card-request.dto';

import { UpdateCreditCardRequestDto } from '@credit-card/application/dtos/update-credit-card/update-credit-card-request.dto';

import { CreateCreditCardResponseDto } from '@credit-card/application/dtos/create-credit-card/create-credit-card-response.dto';

import { ScopedCreditCardActionRequestDto } from '@credit-card/application/dtos/scoped/scoped-credit-card-action-request.dto';

import type { RequestUser } from '@core/strategies/jwt.strategy';

import { CurrentUser } from '@user/infrastructure/decorators/current-user.decorator';

@ApiTags('credit-cards')
@ApiBearerAuth('access-token')
@Controller('accounts/:accountId/credit-cards')
export class CreditCardScopedController {
  public constructor(
    private readonly createCreditCardUseCase: CreateCreditCardUseCase,
    private readonly listCreditCardsUseCase: ListCreditCardsUseCase,
    private readonly getCreditCardUseCase: GetCreditCardUseCase,
    private readonly updateCreditCardUseCase: UpdateCreditCardUseCase,
    private readonly deleteCreditCardUseCase: DeleteCreditCardUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List credit cards for an account belonging to the current user',
  })
  @ApiParam({ name: 'accountId', format: 'uuid' })
  @ApiOkResponse({
    type: CreateCreditCardResponseDto,
    isArray: true,
  })
  public listCards(
    @Param('accountId', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<CreateCreditCardResponseDto[]> {
    return this.listCreditCardsUseCase.execute(
      Object.assign(new ListCreditCardsRequestDto(), {
        accountId,
        userId: user.userId,
      }),
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a credit card to an account you own' })
  @ApiParam({ name: 'accountId', format: 'uuid' })
  @ApiBody({ type: CreateCreditCardBodyDto })
  @ApiCreatedResponse({ type: CreateCreditCardResponseDto })
  public create(
    @Param('accountId', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @CurrentUser() user: RequestUser,
    @Body() body: CreateCreditCardBodyDto,
  ): Promise<CreateCreditCardResponseDto> {
    return this.createCreditCardUseCase.execute(
      CreateCreditCardRequestDto.fromRouteAndBody(accountId, body, user.userId),
    );
  }

  @Get(':creditCardId')
  @ApiOperation({ summary: 'Get one credit card when it belongs to the URL account and user' })
  @ApiParam({ name: 'accountId', format: 'uuid' })
  @ApiParam({ name: 'creditCardId', format: 'uuid' })
  @ApiOkResponse({ type: CreateCreditCardResponseDto })
  public async getOne(
    @Param('accountId', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @Param('creditCardId', new ParseUUIDPipe({ version: '4' })) creditCardId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<CreateCreditCardResponseDto> {
    const found: CreateCreditCardResponseDto | undefined =
      await this.getCreditCardUseCase.execute(
        Object.assign(new ScopedCreditCardActionRequestDto(), {
          accountId,
          creditCardId,
          userId: user.userId,
        }),
      );
    if (found === undefined) {
      throw new NotFoundException('Credit card not found');
    }
    return found;
  }

  @Patch(':creditCardId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update some fields on a credit card you own under this account' })
  @ApiParam({ name: 'accountId', format: 'uuid' })
  @ApiParam({ name: 'creditCardId', format: 'uuid' })
  @ApiBody({ type: UpdateCreditCardBodyDto })
  @ApiOkResponse({ type: CreateCreditCardResponseDto })
  public update(
    @Param('accountId', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @Param('creditCardId', new ParseUUIDPipe({ version: '4' })) creditCardId: string,
    @CurrentUser() user: RequestUser,
    @Body() body: UpdateCreditCardBodyDto,
  ): Promise<CreateCreditCardResponseDto> {
    const req: UpdateCreditCardRequestDto = Object.assign(new UpdateCreditCardRequestDto(), {
      accountId,
      creditCardId,
      userId: user.userId,
      body,
    });
    return this.updateCreditCardUseCase.execute(req);
  }

  @Delete(':creditCardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a credit card you own under this account' })
  @ApiParam({ name: 'accountId', format: 'uuid' })
  @ApiParam({ name: 'creditCardId', format: 'uuid' })
  @ApiNoContentResponse({
    description: 'Deleted; related transactions cascade per database FK.',
  })
  public async delete(
    @Param('accountId', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @Param('creditCardId', new ParseUUIDPipe({ version: '4' })) creditCardId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    await this.deleteCreditCardUseCase.execute(
      Object.assign(new ScopedCreditCardActionRequestDto(), {
        accountId,
        creditCardId,
        userId: user.userId,
      }),
    );
  }
}


