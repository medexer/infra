import {
  UpdateDonationCenterProfileDTO,
  UpdateDonationCenterAccountProfileDTO,
} from '../interface';
import {
  Body,
  Get,
  Req,
  UseGuards,
  Controller,
  Patch,
  Query,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'libs/common/src/auth';
import authUtils from 'libs/common/src/security/auth.utils';
import { SecureUserPayload } from 'libs/common/src/interface';
import { AccountInfo } from 'libs/common/src/models/account.model';
import { AppointmentService } from '../services/appointment.service';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import { DonationCenterInfo } from 'libs/common/src/models/donation.center.model';
import {
  UpdateDonationCenterAccountProfileCommand,
  UpdateDonationCenterProfileCommand,
} from '../commands/impl';

@Controller({ path: 'profile' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    public command: CommandBus,
    public readonly appointmentService: AppointmentService,
  ) {}

  @ApiTags('profile')
  @Patch('')
  @ApiOkResponse({
    type: DonationCenterInfo,
  })
  @ApiInternalServerErrorResponse()
  async updateDonationCenterProfile(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
    @Body() body: UpdateDonationCenterProfileDTO,
  ): Promise<DonationCenterInfo> {
    return await this.command.execute(
      new UpdateDonationCenterProfileCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }

  @ApiTags('profile')
  @Patch('account')
  @ApiOkResponse({
    type: AccountInfo,
  })
  @ApiInternalServerErrorResponse()
  async updateDonationCenterAccountProfile(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
    @Body() body: UpdateDonationCenterAccountProfileDTO,
  ): Promise<AccountInfo> {
    return await this.command.execute(
      new UpdateDonationCenterAccountProfileCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }
}
