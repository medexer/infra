import {
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'libs/common/src/auth';
import { SecureUserPayload } from 'libs/common/src/interface';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DonationCenterOperationsInfo } from 'libs/common/src/models/donation.center.model';
import { OperationsService } from '../services/operations.service';
import {
  UpdateDonationCenterOperationsConfigDTO,
  UpdateDonationCenterWorkingHoursConfigDTO,
} from '../interface';
import {
  UpdateDonationCenterOperationsConfigCommand,
  UpdateDonationCenterDaysOfWorkCommand,
} from '../commands/impl';
import authUtils from 'libs/common/src/security/auth.utils';

@Controller({ path: 'operations' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OperationsController {
  constructor(
    private readonly commandBus: CommandBus,
    public readonly operationsService: OperationsService,
  ) {}

  @ApiTags('operations')
  @Get('')
  @ApiOkResponse({
    type: DonationCenterOperationsInfo,
  })
  @ApiQuery({
    name: 'donationCenterId',
    required: true,
  })
  @ApiInternalServerErrorResponse()
  async getDonationCenterOperationsInfo(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
    @Query('donationCenterId') donationCenterId: number,
  ): Promise<DonationCenterOperationsInfo> {
    return await this.operationsService.getDonationCenterOperationsInfo(
      donationCenterId,
    );
  }

  @ApiTags('operations')
  @Patch('update-config')
  @ApiOkResponse({
    type: DonationCenterOperationsInfo,
  })
  @ApiQuery({
    required: true,
    name: 'donationCenterId',
  })
  @ApiInternalServerErrorResponse()
  async updateDonationCenterOperationsConfig(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
    @Query('donationCenterId') donationCenterId: number,
    @Body() payload: UpdateDonationCenterOperationsConfigDTO,
  ): Promise<DonationCenterOperationsInfo> {
    return await this.commandBus.execute(
      new UpdateDonationCenterOperationsConfigCommand(
        authUtils.getOriginHeader(req),
        donationCenterId,
        payload,
      ),
    );
  }

  @ApiTags('operations')
  @Patch('working-hours')
  @ApiOkResponse({
    type: DonationCenterOperationsInfo,
  })
  @ApiQuery({
    required: true,
    name: 'donationCenterId',
  })
  @ApiInternalServerErrorResponse()
  async updateDonationCenterWorkingHoursConfig(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
    @Query('donationCenterId') donationCenterId: number,
    @Body() payload: UpdateDonationCenterWorkingHoursConfigDTO,
  ): Promise<DonationCenterOperationsInfo> {
    return await this.commandBus.execute(
      new UpdateDonationCenterDaysOfWorkCommand(
        authUtils.getOriginHeader(req),
        donationCenterId,
        payload,
      ),
    );
  }
}
