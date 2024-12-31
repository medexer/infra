import {
  Body,
  Get,
  Req,
  UseGuards,
  Controller,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'libs/common/src/auth';
import { SecureUserPayload } from 'libs/common/src/interface';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import { DonationCenterAppointmentInfo } from 'libs/common/src/models/appointment.model';
import { DonationCenterAppointmentService } from '../services/donation.center.appointment.service';

@Controller({ path: 'appointments' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DonationCenterAppointmentController {
  constructor(
    public command: CommandBus,
    public readonly donationCenterAppointmentService: DonationCenterAppointmentService,
  ) {}

  @ApiTags('appointments')
  @Get('pending-appointments')
  @ApiOkResponse({
    isArray: true,
    type: DonationCenterAppointmentInfo,
  })
  @ApiInternalServerErrorResponse()
  async getPendingAppointments(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DonationCenterAppointmentInfo[]> {
    return await this.donationCenterAppointmentService.getPendingDonationCenterAppointments(secureUser);
  }

  @ApiTags('appointments')
  @Get('completed-appointments')
  @ApiOkResponse({
    isArray: true,
    type: DonationCenterAppointmentInfo,
  })
  @ApiInternalServerErrorResponse()
  async getCompletedAppointments(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DonationCenterAppointmentInfo[]> {
    return await this.donationCenterAppointmentService.getCompletedDonationCenterAppointments(secureUser);
  }
}
