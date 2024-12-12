import { SignInHandler } from './SigninHandler';
import { SignInAsHandler } from './SigninAsHandler';
import { OAuthSignInHandler } from './OAuthSigninHandler';
import { CreateAccountHandler } from './CreateAccountHandler';
import { ResetPasswordHandler } from './ResetPasswordHandler';
import { ForgotPasswordHandler } from './ForgotPasswordHandler';
import { CreateAccountVerificationHandler } from './CreateAccountVerificationHandler';
import { CreateDonationCenterAccountHandler } from './CreateDonationCenterAccountHandler';
import { ResetPasswordOtpVerificationHandler } from './ResetPasswordOtpVerificationHandler';

export const AuthServiceCommandHandlers = [
  SignInHandler,
  SignInAsHandler,
  OAuthSignInHandler,
  CreateAccountHandler,
  ResetPasswordHandler,
  ForgotPasswordHandler,
  CreateAccountVerificationHandler,
  CreateDonationCenterAccountHandler,
  ResetPasswordOtpVerificationHandler,
];
