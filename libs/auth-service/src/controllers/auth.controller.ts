import { CommandBus } from '@nestjs/cqrs';
import {
  CreateDonationCenterAccountDTO,
  ResetPasswordOTPVerificationResponsePayload,
  SigninAsDTO,
  SigninDTO,
  SigninResponsePayload,
  SignupResponsePayload,
  SignupVerificationResponsePayload,
} from '../interface';
import { AuthService } from '../services/auth.service';
import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  CompleteSignupVerificationDTO,
  CreateAccountDTO,
  ForgotPasswordDTO,
  OAuthSigninDTO,
  ResetPasswordDTO,
  ResetPasswordVerificationDTO,
} from '../interface';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateAccountCommand,
  ResetPasswordCommand,
  ForgotPasswordCommand,
  CreateAccountVerificationCommand,
  ResetPasswordOTpVerificationCommand,
  OAuthSignInCommand,
  CreateDonationCenterAccountCommand,
  SignInAsCommand,
} from '../commands/impl';
import { UAParser } from 'ua-parser-js';
import * as clc from 'cli-color';
import authUtils from 'libs/common/src/security/auth.utils';
import { AccountType } from 'libs/common/src/constants/enums';
import { SignInCommand } from '../commands/impl';

// @ApiTags('auth')
@Controller({ path: '' })
export class AuthController {
  constructor(
    public command: CommandBus,
    public readonly authService: AuthService,
  ) {}

  @ApiTags('auth')
  @Post('signup')
  @ApiOkResponse({ type: SignupResponsePayload })
  @ApiConflictResponse()
  async signupDonor(
    @Body() body: CreateAccountDTO,
    @Req() req: Request,
  ): Promise<SignupResponsePayload> {
    return await this.command.execute(
      new CreateAccountCommand(
        authUtils.getOriginHeader(req),
        AccountType.INDIVIDUAL,
        body,
      ),
    );
  }

  @ApiTags('auth')
  @Post('signup-complete-verification')
  @ApiOkResponse({ type: SignupVerificationResponsePayload })
  @ApiConflictResponse()
  async signupCompleteVerification(
    @Body() body: CompleteSignupVerificationDTO,
    @Req() req: Request,
  ): Promise<SignupVerificationResponsePayload> {
    return await this.command.execute(
      new CreateAccountVerificationCommand(
        authUtils.getOriginHeader(req),
        body,
      ),
    );
  }

  @ApiTags('auth')
  @Post('signup-donation-center')
  @ApiOkResponse({ type: SigninResponsePayload })
  @ApiConflictResponse()
  async signupDonationCenter(
    @Body() body: CreateDonationCenterAccountDTO,
    @Req() req: Request,
  ): Promise<SigninResponsePayload> {
    return await this.command.execute(
      new CreateDonationCenterAccountCommand(
        authUtils.getOriginHeader(req),
        body,
      ),
    );
  }

  @ApiTags('auth')
  @Post('signin')
  @ApiOkResponse({ type: SigninResponsePayload })
  @ApiConflictResponse()
  async signinDonor(
    @Body() body: SigninDTO,
    @Req() req: Request,
  ): Promise<SigninResponsePayload> {
    return await this.command.execute(
      new SignInCommand(authUtils.getOriginHeader(req), body),
    );
  }

  @ApiTags('auth')
  @Post('signin/as')
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: SigninResponsePayload })
  async signinAs(
    @Req() req: Request,
    @Body() body: SigninAsDTO,
  ): Promise<SigninResponsePayload> {
    return await this.command.execute(
      new SignInAsCommand(authUtils.getOriginHeader(req), body),
    );
  }

  @ApiTags('auth')
  @Post('signin-oauth')
  @ApiOkResponse({ type: SigninResponsePayload })
  @ApiConflictResponse()
  async signinOAuth(
    @Body() body: OAuthSigninDTO,
    @Req() req: Request,
  ): Promise<SigninResponsePayload> {
    return await this.command.execute(
      new OAuthSignInCommand(authUtils.getOriginHeader(req), body),
    );
  }

  @ApiTags('password')
  @Post('forgot-password')
  @ApiOkResponse()
  @ApiConflictResponse()
  async forgotPassword(@Body() body: ForgotPasswordDTO, @Req() req: Request) {
    return await this.command.execute(
      new ForgotPasswordCommand(authUtils.getOriginHeader(req), body),
    );
  }

  @ApiTags('password')
  @Post('reset-password')
  @ApiOkResponse()
  @ApiConflictResponse()
  async resetPassword(@Body() body: ResetPasswordDTO, @Req() req: Request) {
    return await this.command.execute(
      new ResetPasswordCommand(authUtils.getOriginHeader(req), body),
    );
  }

  @ApiTags('password')
  @Post('reset-password-otp-verification')
  @ApiOkResponse({ type: ResetPasswordOTPVerificationResponsePayload })
  @ApiConflictResponse()
  async resetPasswordOtpVerification(
    @Body() body: ResetPasswordVerificationDTO,
    @Req() req: Request,
  ): Promise<ResetPasswordOTPVerificationResponsePayload> {
    return await this.command.execute(
      new ResetPasswordOTpVerificationCommand(
        authUtils.getOriginHeader(req),
        body,
      ),
    );
  }
}
