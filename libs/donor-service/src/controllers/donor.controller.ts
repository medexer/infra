import { CommandBus } from '@nestjs/cqrs';
import { DonorService } from '../services/donor.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SecureUserPayload } from 'libs/common/src/interface';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import {
  ApiBearerAuth,
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
import { DonationCenterAvailability, DonationCenterInfo, DonationCentreDaysOfWork } from 'libs/common/src/models/donation.center.model';

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

  @ApiTags('feed')
  @Get('donation-center/:id')
  @ApiOkResponse({
    type: DonationCenterInfo,
  })
  @ApiInternalServerErrorResponse()
  async getDonationCenter(
    @Req() req: Request,
    @Param('id') donationCenterId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DonationCenterInfo> {
    return await this.donorService.getDonationCenter(donationCenterId);
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

  @ApiTags('donation-center')
  @Get('donation-center/:id/appointment-availability')
  @ApiOkResponse({
    isArray: true,
    type: DonationCenterAvailability,
  })
  @ApiParam({ name: 'id', description: 'Donation center ID' })
  @ApiInternalServerErrorResponse()
  async getDonationCenterAppointmentAvailability(
    @Req() req: Request,
    @Param('id') donationCenterId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DonationCenterAvailability[]> {
    return await this.donorService.getDonationCenterAppointmentAvailability(donationCenterId);
  }
}
