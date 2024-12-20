import {
  DonationCentreDaysOfWork,
  DaysOfWork,
  DonationCenter,
  DonationCenterCompliance,
  DonationCenterComplianceResponse,
  DonationCenterInfo,
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
      : account.lastDonationDate.toString(),
  } as AccountInfo;
}

export function FormatDetailedDonationCenterAccountResponse(
  donationCenter: DonationCenter,
): DonationCenterInfo {
  delete donationCenter.account;
  delete donationCenter.createdAt;
  delete donationCenter.updatedAt;

  return {
    ...donationCenter,
    id: donationCenter.id.toString(),
  } as DonationCenterInfo;
}

export function FormatDonationCenterDaysOfWork(
  daysOfWork: DaysOfWork,
): DonationCentreDaysOfWork[] {
  if (!daysOfWork) return [];

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  return days.map((day) => ({
    day,
    open: daysOfWork[day]?.open || '09:00',
    close: daysOfWork[day]?.close || '17:00',
    alwaysOpen: daysOfWork[day]?.alwaysOpen || false,
    closed: daysOfWork[day]?.closed || false,
  })) as DonationCentreDaysOfWork[];
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
  FormatDonationCenterDaysOfWork,
  FormatDonationCenterComplianceResponse,
  FormatDetailedDonationCenterAccountResponse,
};
