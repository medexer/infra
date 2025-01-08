import {
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'libs/common/src/auth';
import { DashboardInfo } from '../interface/response';
import { SecureUserPayload } from 'libs/common/src/interface';
import {
  Get,
  Req,
  UseGuards,
  Controller,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import { DashboardQueryParams } from '../interface';

@ApiTags('dashboard')
@Controller({ path: 'dashboard' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(public readonly dashboardService: DashboardService) {}

  @Get('')
  @ApiOkResponse({
    type: DashboardInfo,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Optional start date of the report period (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Optional end date of the report period (YYYY-MM-DD)',
  })
  @ApiInternalServerErrorResponse()
  async getDashboardData(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
    @Query(new ValidationPipe({ transform: true })) query: DashboardQueryParams,
  ): Promise<DashboardInfo> {
    const parsedStartDate = query.startDate
      ? new Date(query.startDate)
      : undefined;
    const parsedEndDate = query.endDate ? new Date(query.endDate) : undefined;

    return await this.dashboardService.getDashboardData(
      secureUser,
      parsedStartDate,
      parsedEndDate,
    );
  }
}
