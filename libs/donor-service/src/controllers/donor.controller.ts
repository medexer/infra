import { CommandBus } from '@nestjs/cqrs';
import { DonorService } from '../services/donor.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SecureUserPayload } from 'libs/common/src/interface';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import {
    ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadDonorComplianceCommand } from '../commands/impl';
import authUtils from 'libs/common/src/security/auth.utils';
import { UploadDonorComplianceDTO } from '../interface';
import { JwtAuthGuard } from 'libs/common/src/auth';

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
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async uploadCompliance(
    @Req() req: Request,
    @Body() body: UploadDonorComplianceDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new UploadDonorComplianceCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }
}
