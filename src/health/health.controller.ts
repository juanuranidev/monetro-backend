import { Get, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { PublicRoute } from '@core/decorators/public-route.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiOkResponse({
    schema: { type: 'object', properties: { status: { type: 'string' } } },
  })
  public getHealth(): { readonly status: string } {
    return { status: 'ok' };
  }
}
