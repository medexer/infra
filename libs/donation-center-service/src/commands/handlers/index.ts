import { UpdateAppointmentStatusHandler } from './UpdateAppointmentStatusHandler';
import { UploadAppointmentTestResultsHandler } from './UploadAppointmentTestResultsHandler';
import { UploadDonationCenterComplianceDetailsHandler } from './UploadDonationCenterComplianceDetailsHandler';
import { UploadDonationCenterComplianceAddressHandler } from './UploadDonationCenterComplianceAddressHandler';
import { UploadDonationCenterComplianceCredentialsHandler } from './UploadDonationCenterComplianceCredentialsHandler';

export const DonationCenterServiceCommandHandlers = [
  UpdateAppointmentStatusHandler,
  UploadAppointmentTestResultsHandler,
  UploadDonationCenterComplianceDetailsHandler,
  UploadDonationCenterComplianceAddressHandler,
  UploadDonationCenterComplianceCredentialsHandler,
];

