import {
  CompleteSignupVerificationDTO,
  CreateAccountDTO,
  CreateDonationCenterAccountDTO,
  ForgotPasswordDTO,
  OAuthSigninDTO,
  ResetPasswordDTO,
  ResetPasswordVerificationDTO,
  SigninAsDTO,
  SigninDTO,
} from '../../interface';
import { AccountType } from 'libs/common/src/constants/enums';

export class SignInCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: SigninDTO,
  ) {}
}

export class SignInAsCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: SigninAsDTO,
  ) {}
}

export class OAuthSignInCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: OAuthSigninDTO,
  ) {}
}

export class CreateAccountCommand {
  constructor(
    public readonly origin: string,
    public readonly accountType: AccountType,
    public readonly payload: CreateAccountDTO,
    public readonly createdWithGoogle?: boolean,
  ) {}
}

export class CreateDonationCenterAccountCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: CreateDonationCenterAccountDTO,
  ) {}
}

export class CreateAccountVerificationCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: CompleteSignupVerificationDTO,
  ) {}
}

export class ForgotPasswordCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: ForgotPasswordDTO,
  ) {}
}

export class ResetPasswordCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: ResetPasswordDTO,
  ) {}
}

export class ResetPasswordOTpVerificationCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: ResetPasswordVerificationDTO,
  ) {}
}
