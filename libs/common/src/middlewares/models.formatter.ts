import {
  DonationCenter,
  DonationCenterCompliance,
  DonationCenterComplianceResponse,
} from '../models/donation.center.model';
import { Account, AccountInfo } from '../models/account.model';

export function FormatAccountInfo(account: Account): AccountInfo {
  delete account.password;
  delete account.newEmail;
  delete account.newPhone;
  delete account.createdAt;
  delete account.updatedAt;
  delete account.activationCode;
  delete account.passwordResetCode;
  delete account.passwordResetToken;
  delete account.temporalAccessToken;
  delete account.activationCodeExpires;
  delete account.signupVerificationHash;
  delete account.signupVerificationHash;
  delete account.passwordResetCodeExpires;

  return {
    ...account,
    id: account.id.toString(),
    lastDonationDate: !account.lastDonationDate
      ? ''
      : account.lastDonationDate.toISOString(),
  } as AccountInfo;
}

export function FormatDetailedDonationCenterAccountResponse(
  donationCenter: DonationCenter,
) {
  delete donationCenter.account;
  delete donationCenter.createdAt;
  delete donationCenter.updatedAt;

  return donationCenter;
}

export function FormatDonationCenterComplianceResponse(
  donationCenter: DonationCenter,
  compliance: DonationCenterCompliance,
): DonationCenterComplianceResponse {
  delete donationCenter.account;
  delete donationCenter.createdAt;
  delete donationCenter.updatedAt;

  delete compliance.donationCenter;

  return { ...donationCenter, ...compliance };
}

export default {
  FormatAccountInfo,
  FormatDonationCenterComplianceResponse,
  FormatDetailedDonationCenterAccountResponse,
};
