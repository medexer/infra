import { UpdateAppointmentStatusHandler } from './UpdateAppointmentStatusHandler';
import { UploadDonationCenterComplianceDetailsHandler } from './UploadDonationCenterComplianceDetailsHandler';
import { UploadDonationCenterComplianceAddressHandler } from './UploadDonationCenterComplianceAddressHandler';
import { UploadDonationCenterComplianceCredentialsHandler } from './UploadDonationCenterComplianceCredentialsHandler';

export const DonationCenterServiceCommandHandlers = [
  UpdateAppointmentStatusHandler,
  UploadDonationCenterComplianceDetailsHandler,
  UploadDonationCenterComplianceAddressHandler,
  UploadDonationCenterComplianceCredentialsHandler,
];

