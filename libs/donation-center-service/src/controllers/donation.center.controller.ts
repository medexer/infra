import {
  DonationCenterComplianceAddressDTO,
  DonationCenterComplianceDetailsDTO,
  DonationCenterComplianceCredentialsDTO,
} from '../interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  UploadDonationCenterComplianceAddressCommand,
  UploadDonationCenterComplianceDetailsCommand,
  UploadDonationCenterComplianceCredentialsCommand,
} from '../commands/impl';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'libs/common/src/auth';
import authUtils from 'libs/common/src/security/auth.utils';
import { SecureUserPayload } from 'libs/common/src/interface';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import { DonationCenterService } from '../services/donation.center.service';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  DonationCenterComplianceResponse,
  DonationCenterInfo,
} from 'libs/common/src/models/donation.center.model';

@Controller({ path: '' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DonationCenterController {
  constructor(
    public command: CommandBus,
    public readonly donationCenterService: DonationCenterService,
  ) {}

  @ApiTags('donation-center')
  @Get('profile')
  @ApiOkResponse({ type: DonationCenterInfo })
  @ApiInternalServerErrorResponse()
  async getDonationCenterProfile(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DonationCenterInfo> {
    return await this.donationCenterService.getDonationCenterProfile(
      secureUser,
    );
  }

  @ApiTags('compliance')
  @Patch('compliance')
  @ApiOkResponse({ type: DonationCenterComplianceResponse })
  @ApiInternalServerErrorResponse()
  async uploadComplianceCredentials(
    @Req() req: Request,
    @Body() body: DonationCenterComplianceCredentialsDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new UploadDonationCenterComplianceCredentialsCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }

  @ApiTags('compliance')
  @Patch('compliance/details')
  @ApiOkResponse({ type: DonationCenterComplianceResponse })
  @ApiInternalServerErrorResponse()
  async uploadComplianceDetails(
    @Req() req: Request,
    @Body() body: DonationCenterComplianceDetailsDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new UploadDonationCenterComplianceDetailsCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }

  @ApiTags('compliance')
  @Patch('compliance/address')
  @ApiOkResponse({
    type: DonationCenterComplianceResponse,
  })
  @ApiInternalServerErrorResponse()
  async uploadComplianceAddress(
    @Req() req: Request,
    @Body() body: DonationCenterComplianceAddressDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DonationCenterComplianceResponse> {
    return await this.command.execute(
      new UploadDonationCenterComplianceAddressCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }
}
