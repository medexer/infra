import {
  Get,
  Req,
  Post,
  Body,
  Patch,
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
import authUtils from 'libs/common/src/security/auth.utils';
import { AccountService } from '../services/account.service';
import { SecureUserPayload } from 'libs/common/src/interface';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';
import { SecureUser } from 'libs/common/src/decorator/user.decorator';
import {
  UpdateAccountEmailDTO,
  UpdateAccountPasswordDTO,
  UpdateAccountPhoneDTO,
  UpdateFCMTokenDTO,
  VerifyNewAccountEmailDTO,
} from '../interface';
import {
  UpdateAccountEmailCommand,
  UpdateAccountFCMTokenCommand,
  UpdateAccountPasswordCommand,
  UpdateAccountPhoneCommand,
  VerifyNewAccountEmailCommand,
} from '../commands/impl';

@Controller({ path: 'me' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(
    public command: CommandBus,
    public readonly accountService: AccountService,
  ) {}

  @ApiTags('me')
  @Get('detailed')
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async getDetailedAccountInfo(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.accountService.getDetailedProfile(secureUser);
  }

  @ApiTags('me')
  @Patch('update-fcm-token')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async updateFcmToken(
    @Req() req: Request,
    @Body() body: UpdateFCMTokenDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new UpdateAccountFCMTokenCommand(
        authUtils.getOriginHeader(req),
        body,
        secureUser,
      ),
    );
  }

  @ApiTags('me')
  @Patch('update-password')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async updateAccountPassword(
    @Req() req: Request,
    @Body() body: UpdateAccountPasswordDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new UpdateAccountPasswordCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }

  @ApiTags('manage-contact-info')
  @Post('update-email')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async updateAccountEmail(
    @Req() req: Request,
    @Body() body: UpdateAccountEmailDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new UpdateAccountEmailCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }

  @ApiTags('manage-contact-info')
  @Patch('verify-new-email')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async verifyNewAccountEmail(
    @Req() req: Request,
    @Body() body: VerifyNewAccountEmailDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new VerifyNewAccountEmailCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }

  @ApiTags('manage-contact-info')
  @Patch('update-phone')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async updateAccountPhone(
    @Req() req: Request,
    @Body() body: UpdateAccountPhoneDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new UpdateAccountPhoneCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }
}
