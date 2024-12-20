import { CommandBus } from '@nestjs/cqrs';
import { DonorService } from '../services/donor.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SecureUserPayload } from 'libs/common/src/interface';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UploadDonorComplianceCommand } from '../commands/impl';
import authUtils from 'libs/common/src/security/auth.utils';
import { UploadDonorComplianceDTO } from '../interface';
import { JwtAuthGuard } from 'libs/common/src/auth';
import { AccountInfo } from 'libs/common/src/models/account.model';
import { DonationCenterInfo, DonationCentreDaysOfWork } from 'libs/common/src/models/donation.center.model';

@Controller({ path: '' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DonorController {
  constructor(
    public command: CommandBus,
    public readonly donorService: DonorService,
  ) {}

  @ApiTags('compliance')
  @Post('upload-compliance')
  @ApiOkResponse({
    type: AccountInfo,
  })
  @ApiInternalServerErrorResponse()
  async uploadCompliance(
    @Req() req: Request,
    @Body() body: UploadDonorComplianceDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.command.execute(
      new UploadDonorComplianceCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }

  @ApiTags('feed')
  @Get('donation-centers')
  @ApiOkResponse({
    isArray: true,
    type: DonationCenterInfo,
  })
  @ApiInternalServerErrorResponse()
  async getDonationCenters(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DonationCenterInfo[]> {
    return await this.donorService.getDonationCenters();
  }

  @ApiTags('donation-center')
  @Get('donation-center/:id/days-of-work')
  @ApiOkResponse({
    isArray: true,
    type: DonationCentreDaysOfWork,
  })
  @ApiParam({ name: 'id', description: 'Donation center ID' })
  @ApiInternalServerErrorResponse()
  async getDonationCenterDaysOfWork(
    @Req() req: Request,
    @Param('id') donationCenterId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DonationCentreDaysOfWork[]> {
    return await this.donorService.getDonationCenterDaysOfWork(donationCenterId);
  }
}
