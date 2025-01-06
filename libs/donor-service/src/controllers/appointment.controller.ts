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
import {
    ApiTags,
    ApiQuery,
    ApiBearerAuth,
    ApiOkResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
    CreateAppointmentCommand,
    AddDonationCenterRatingCommand,
} from '../commands/impl';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'libs/common/src/auth';
import authUtils from 'libs/common/src/security/auth.utils';
import { SecureUserPayload } from 'libs/common/src/interface';
import { AppointmentService } from '../services/appointment.service';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import { AppointmentInfo } from 'libs/common/src/models/appointment.model';
import { CreateAppointmentDTO, AddDonationCenterRatingDTO } from '../interface';

@Controller({ path: 'appointment' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(
    public command: CommandBus,
    public readonly appointmentService: AppointmentService,
  ) {}

  @ApiTags('appointment')
  @Post('add-rating')
  @ApiOkResponse()
  @ApiQuery({ name: 'appointmentId', description: 'Appointment ID' })
  @ApiInternalServerErrorResponse()
  async addDonationCenterRating(
    @Req() req: Request,
    @Query('appointmentId') appointmentId: number,
    @SecureUser() secureUser: SecureUserPayload,
    @Body() body: AddDonationCenterRatingDTO,
  ): Promise<void> {
    return await this.command.execute(
      new AddDonationCenterRatingCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        appointmentId,
        body,
      ),
    );
  }

  @ApiTags('appointment')
  @Post('create')
  @ApiOkResponse({
    type: AppointmentInfo,
  })
  @ApiQuery({ name: 'donationCenter', description: 'Donation center ID' })
  @ApiInternalServerErrorResponse()
  async createAppointment(
    @Req() req: Request,
    @Body() body: CreateAppointmentDTO,
    @Query('donationCenter') donationCenterId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AppointmentInfo> {
    return await this.command.execute(
      new CreateAppointmentCommand(authUtils.getOriginHeader(req), secureUser, {
        ...body,
        donationCenter: donationCenterId,
      }),
    );
  }

  @ApiTags('appointment')
  @Get('pending-appointments')
  @ApiOkResponse({
    isArray: true,
    type: AppointmentInfo,
  })
  @ApiInternalServerErrorResponse()
  async getPendingAppointments(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AppointmentInfo[]> {
    return await this.appointmentService.getPendingDonorAppointments(secureUser);
  }

  @ApiTags('appointment')
  @Get('completed-appointments')
  @ApiOkResponse({
    isArray: true,
    type: AppointmentInfo,
  })
  @ApiInternalServerErrorResponse()
  async getCompletedAppointments(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AppointmentInfo[]> {
    return await this.appointmentService.getCompletedDonorAppointments(secureUser);
  }
}
