import {
  DonationCentreDaysOfWork,
  DaysOfWork,
  DonationCenter,
  DonationCenterCompliance,
  DonationCenterComplianceInfo,
  DonationCenterInfo,
} from '../models/donation.center.model';
import { Account, AccountInfo } from '../models/account.model';
import { AppointmentInfo } from '../models/appointment.model';
import { Appointment } from '../models/appointment.model';
import {
  MedicalHistory,
  MedicalHistoryInfo,
} from '../models/medical.history.model';
import { Notification } from '../models/notification.model';
import { NotificationInfo } from '../models/notification.model';
import { ListItem, ListItemInfo } from '../models/list.item.model';

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

  const totalRatings =
    Number(donationCenter.ratingOne || 0) +
    Number(donationCenter.ratingTwo || 0) +
    Number(donationCenter.ratingThree || 0) +
    Number(donationCenter.ratingFour || 0) +
    Number(donationCenter.ratingFive || 0);

  const weightedSum =
    Number(donationCenter.ratingOne || 0) * 1 +
    Number(donationCenter.ratingTwo || 0) * 2 +
    Number(donationCenter.ratingThree || 0) * 3 +
    Number(donationCenter.ratingFour || 0) * 4 +
    Number(donationCenter.ratingFive || 0) * 5;

  const averageRating = totalRatings
    ? Math.min(5, Math.max(0, weightedSum / totalRatings))
    : 0;

  delete donationCenter.ratingOne;
  delete donationCenter.ratingTwo;
  delete donationCenter.ratingThree;
  delete donationCenter.ratingFour;
  delete donationCenter.ratingFive;

  return {
    ...donationCenter,
    id: donationCenter.id.toString(),
    averageRating: Number(averageRating.toFixed(1)).toString(),
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

export function FormatDonationCenterComplianceInfo(
  donationCenter: DonationCenter,
  compliance: DonationCenterCompliance,
): DonationCenterComplianceInfo {
  delete donationCenter.account;
  delete donationCenter.createdAt;
  delete donationCenter.updatedAt;
  delete donationCenter.ratingOne;
  delete donationCenter.ratingTwo;
  delete donationCenter.ratingThree;
  delete donationCenter.ratingFour;
  delete donationCenter.ratingFive;

  delete compliance.donationCenter;

  return { ...donationCenter, ...compliance };
}

export function FormatDonorAppointment(
  appointment: Appointment,
): AppointmentInfo {
  const donationCenter = appointment.donation_center;

  return {
    id: appointment.id.toString(),
    date: appointment.date,
    time: appointment.time,
    status: appointment.status,
    centerName: donationCenter.name,
    centerPhone: donationCenter.phone,
    centerEmail: donationCenter.email,
    centerLogo: donationCenter.logo,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
    centerAddress: donationCenter.address,
    centerLatitude: donationCenter.latitude,
    centerLongitude: donationCenter.longitude,
    appointmentId: appointment.appointmentId,
    centerCoverPhoto: donationCenter.coverPhoto,
    verificationCode: appointment.verificationCode,
  } as AppointmentInfo;
}

export function FormatMedicalHistoryInfo(
  medicalHistory: MedicalHistory,
): MedicalHistoryInfo {
  const donationCenter = medicalHistory.appointment.donation_center;

  return {
    hiv1: medicalHistory.hiv1,
    hiv2: medicalHistory.hiv2,
    centerName: donationCenter.name,
    id: medicalHistory.id.toString(),
    genotype: medicalHistory.genotype,
    syphilis: medicalHistory.syphilis,
    centerPhone: donationCenter.phone,
    centerEmail: donationCenter.email,
    createdAt: medicalHistory.createdAt,
    bloodGroup: medicalHistory.bloodGroup,
    hepatitisB: medicalHistory.hepatitisB,
    hepatitisC: medicalHistory.hepatitisC,
    centerAddress: donationCenter.address,
    centerLatitude: donationCenter.latitude,
    centerLongitude: donationCenter.longitude,
    centerCoverPhoto: donationCenter.coverPhoto,
    appointmentId: medicalHistory.appointment.id.toString(),
  } as MedicalHistoryInfo;
}

export function FormatNotificationInfo(
  notification: Notification,
): NotificationInfo {
  return {
    id: notification.id.toString(),
    subject: notification.subject,
    message: notification.message,
    type: notification.type,
    isRead: notification.isRead,
    appointment: notification.appointment?.id.toString(),
  } as NotificationInfo;
}

export function FormatListItemInfo(listItem: ListItem): ListItemInfo {
  delete listItem.account;

  return {
    itemId: listItem.itemId,
    id: listItem.id.toString(),
    itemType: listItem.itemType,
    entityType: listItem.entityType,
  } as ListItemInfo;
}

export default {
  FormatAccountInfo,
  FormatListItemInfo,
  FormatNotificationInfo,
  FormatDonorAppointment,
  FormatMedicalHistoryInfo,
  FormatDonationCenterDaysOfWork,
  FormatDonationCenterComplianceInfo,
  FormatDetailedDonationCenterAccountResponse,
};
