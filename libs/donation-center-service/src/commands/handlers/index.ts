import { UpdateAppointmentStatusHandler } from './UpdateAppointmentStatusHandler';
import { UpdateDonationCenterProfileHandler } from './UpdateDonationCenterProfileHandler';
import { UploadAppointmentTestResultsHandler } from './UploadAppointmentTestResultsHandler';
import { UpdateBloodInventoryItemPriceHandler } from './UpdateBloodInventoryItemPriceHandler';
import { AddDispenseBloodInventoryItemHandler } from './AddDispenseBloodInventoryItemHandler';
import { UpdateDonationCenterDaysOfWorkHandler } from './UpdateDonationCenterDaysOfWorkHandler';
import { UpdateDonationCenterAccountProfileHandler } from './UpdateDonationCenterAccountProfileHandler';
import { UpdateDonationCenterOperationsConfigHandler } from './UpdateDonationCenterOperationsConfigHandler';
import { UploadDonationCenterComplianceDetailsHandler } from './UploadDonationCenterComplianceDetailsHandler';
import { UploadDonationCenterComplianceAddressHandler } from './UploadDonationCenterComplianceAddressHandler';
import { UploadDonationCenterComplianceCredentialsHandler } from './UploadDonationCenterComplianceCredentialsHandler';

export const DonationCenterServiceCommandHandlers = [
  UpdateAppointmentStatusHandler,
  UploadAppointmentTestResultsHandler,
  UpdateDonationCenterProfileHandler,
  UpdateBloodInventoryItemPriceHandler,
  AddDispenseBloodInventoryItemHandler,
  UpdateDonationCenterDaysOfWorkHandler,
  UpdateDonationCenterAccountProfileHandler,
  UpdateDonationCenterOperationsConfigHandler,
  UploadDonationCenterComplianceDetailsHandler,
  UploadDonationCenterComplianceAddressHandler,
  UploadDonationCenterComplianceCredentialsHandler,
];
