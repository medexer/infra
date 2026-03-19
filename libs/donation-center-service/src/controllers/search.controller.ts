import {
  Get,
  Req,
  UseGuards,
  Controller,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'libs/common/src/auth';
import {
  DonationCenterInfo,
} from 'libs/common/src/models/donation.center.model';
import { SearchBloodDonorsQuery } from '../queries/impl';
import { SecureUserPayload } from 'libs/common/src/interface';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import { DonationCenterService } from '../services/donation.center.service';
import { BloodDonorInfo } from 'libs/common/src/models/account.model';

@Controller({ path: '' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(
    public queryBus: QueryBus,
    public commandBus: CommandBus,
    public readonly donationCenterService: DonationCenterService,
  ) { }

  @ApiTags('search')
  @Get('blood-donors/search')
  @ApiQuery({
    name: 'query',
    example: 'A+ | AS | Plateau | Jos | Keffi',
    description: 'Query params describing what user is looking for.',
  })
  @ApiOkResponse({ type: BloodDonorInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async searchBloodDonors(
    @Req() req: Request,
    @Query('query') query: string,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BloodDonorInfo[]> {
    return await this.queryBus.execute(
      new SearchBloodDonorsQuery(query, secureUser),
    );
  }
}
