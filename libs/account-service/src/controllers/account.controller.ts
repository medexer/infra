import {
  Get,
  Req,
  Post,
  Body,
  Patch,
  UseGuards,
  Controller,
  Delete,
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
  DeleteAccountDTO,
  UpdateAccountEmailDTO,
  UpdateAccountNameDTO,
  UpdateAccountPasswordDTO,
  UpdateAccountPhoneDTO,
  UpdateFCMTokenDTO,
  UpdateProfileImageDTO,
  VerifyNewAccountEmailDTO,
} from '../interface';
import {
  DeleteAccountCommand,
  UpdateAccountEmailCommand,
  UpdateAccountFCMTokenCommand,
  UpdateAccountNameCommand,
  UpdateProfileImageCommand,
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
  @Patch('update-profile-image')
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async updateProfileImage(
    @Req() req: Request,
    @Body() body: UpdateProfileImageDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.command.execute(
      new UpdateProfileImageCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
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

  @ApiTags('me')
  @Delete('delete')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async deleteAccount(
    @Req() req: Request,
    @Body() body: DeleteAccountDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new DeleteAccountCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }

  @ApiTags('manage-contact-info')
  @Patch('update-name')
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async updateAccountName(
    @Req() req: Request,
    @Body() body: UpdateAccountNameDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.command.execute(
      new UpdateAccountNameCommand(
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
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async verifyNewAccountEmail(
    @Req() req: Request,
    @Body() body: VerifyNewAccountEmailDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
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
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async updateAccountPhone(
    @Req() req: Request,
    @Body() body: UpdateAccountPhoneDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.command.execute(
      new UpdateAccountPhoneCommand(
        authUtils.getOriginHeader(req),
        secureUser,
        body,
      ),
    );
  }
}
