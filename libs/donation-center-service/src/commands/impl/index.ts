import {
  UploadTestResultsDTO,
  UpdateAppointmentStatusDTO,
  AddDispenseBloodInventoryItemDTO,
  DonationCenterComplianceAddressDTO,
  DonationCenterComplianceDetailsDTO,
  DonationCenterComplianceCredentialsDTO,
  UpdateBloodInventoryItemPriceDTO,
  UpdateDonationCenterOperationsConfigDTO,
  UpdateDonationCenterWorkingHoursConfigDTO,
} from '../../interface';
import { SecureUserPayload } from 'libs/common/src/interface';

export class UploadDonationCenterComplianceCredentialsCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: DonationCenterComplianceCredentialsDTO,
  ) {}
}

export class UploadDonationCenterComplianceDetailsCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: DonationCenterComplianceDetailsDTO,
  ) {}
}

export class UploadDonationCenterComplianceAddressCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: DonationCenterComplianceAddressDTO,
  ) {}
}

export class UpdateAppointmentStatusCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAppointmentStatusDTO,
  ) {}
}

export class UploadTestResultsCommand {
  constructor(
    public readonly origin: string,
    public readonly appointmentId: number,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UploadTestResultsDTO,
  ) {}
}

export class AddDispenseBloodInventoryItemCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: AddDispenseBloodInventoryItemDTO,
  ) {}
}

export class UpdateBloodInventoryItemPriceCommand {
  constructor(
    public readonly origin: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateBloodInventoryItemPriceDTO,
  ) {}
}

export class UpdateDonationCenterOperationsConfigCommand {
  constructor(
    public readonly origin: string,
    public readonly donationCenterId: number,
    public readonly payload: UpdateDonationCenterOperationsConfigDTO,
  ) {}
}

export class UpdateDonationCenterDaysOfWorkCommand {
  constructor(
    public readonly origin: string,
    public readonly donationCenterId: number,
    public readonly payload: UpdateDonationCenterWorkingHoursConfigDTO,
  ) {}
}