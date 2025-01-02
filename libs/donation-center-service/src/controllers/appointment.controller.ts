import { Body, Get, Req, UseGuards, Controller, Patch, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'libs/common/src/auth';
import { SecureUserPayload } from 'libs/common/src/interface';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import { DonationCenterAppointmentInfo } from 'libs/common/src/models/appointment.model';
import { AppointmentStatus } from 'libs/common/src/constants/enums';
import { AppointmentService } from '../services/appointment.service';
import { UpdateAppointmentStatusDTO } from '../interface';
import { UpdateAppointmentStatusCommand } from '../commands/impl';
import authUtils from 'libs/common/src/security/auth.utils';

@Controller({ path: 'appointments' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(
    public command: CommandBus,
    public readonly AppointmentService: AppointmentService,
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
    return await this.AppointmentService.getPendingAppointments(
      secureUser,
    );
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
    return await this.AppointmentService.getCompletedAppointments(
      secureUser,
    );
  }

  @ApiTags('appointment')
  @Patch('update-status')
  @ApiOkResponse({
    type: DonationCenterAppointmentInfo,
  })
  @ApiInternalServerErrorResponse()
  async updateAppointmentStatus(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
    @Body() body: UpdateAppointmentStatusDTO,
  ): Promise<DonationCenterAppointmentInfo[]> {
      return await this.command.execute(
        new UpdateAppointmentStatusCommand(
          authUtils.getOriginHeader(req),
          secureUser,
          body,
        ),
      );
  }
}
