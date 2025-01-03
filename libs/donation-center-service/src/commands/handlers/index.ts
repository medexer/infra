import { UpdateAppointmentStatusHandler } from './UpdateAppointmentStatusHandler';
import { UploadAppointmentTestResultsHandler } from './UploadAppointmentTestResultsHandler';
import { UpdateBloodInventoryItemPriceHandler } from './UpdateBloodInventoryItemPriceHandler';
import { AddDispenseBloodInventoryItemHandler } from './AddDispenseBloodInventoryItemHandler';
import { UploadDonationCenterComplianceDetailsHandler } from './UploadDonationCenterComplianceDetailsHandler';
import { UploadDonationCenterComplianceAddressHandler } from './UploadDonationCenterComplianceAddressHandler';
import { UploadDonationCenterComplianceCredentialsHandler } from './UploadDonationCenterComplianceCredentialsHandler';

export const DonationCenterServiceCommandHandlers = [
  UpdateAppointmentStatusHandler,
  UploadAppointmentTestResultsHandler,
  UpdateBloodInventoryItemPriceHandler,
  AddDispenseBloodInventoryItemHandler,
  UploadDonationCenterComplianceDetailsHandler,
  UploadDonationCenterComplianceAddressHandler,
  UploadDonationCenterComplianceCredentialsHandler,
];
