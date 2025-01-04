import { UpdateAppointmentStatusHandler } from './UpdateAppointmentStatusHandler';
import { UploadAppointmentTestResultsHandler } from './UploadAppointmentTestResultsHandler';
import { UpdateBloodInventoryItemPriceHandler } from './UpdateBloodInventoryItemPriceHandler';
import { AddDispenseBloodInventoryItemHandler } from './AddDispenseBloodInventoryItemHandler';
import { UpdateDonationCenterDaysOfWorkHandler } from './UpdateDonationCenterDaysOfWorkHandler';
import { UpdateDonationCenterOperationsConfigHandler } from './UpdateDonationCenterOperationsConfigHandler';
import { UploadDonationCenterComplianceDetailsHandler } from './UploadDonationCenterComplianceDetailsHandler';
import { UploadDonationCenterComplianceAddressHandler } from './UploadDonationCenterComplianceAddressHandler';
import { UploadDonationCenterComplianceCredentialsHandler } from './UploadDonationCenterComplianceCredentialsHandler';

export const DonationCenterServiceCommandHandlers = [
  UpdateAppointmentStatusHandler,
  UploadAppointmentTestResultsHandler,
  UpdateBloodInventoryItemPriceHandler,
  AddDispenseBloodInventoryItemHandler,
  UpdateDonationCenterDaysOfWorkHandler,
  UpdateDonationCenterOperationsConfigHandler,
  UploadDonationCenterComplianceDetailsHandler,
  UploadDonationCenterComplianceAddressHandler,
  UploadDonationCenterComplianceCredentialsHandler,
];
