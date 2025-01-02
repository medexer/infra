import {
  DonationCenterComplianceAddressDTO,
  DonationCenterComplianceDetailsDTO,
  DonationCenterComplianceCredentialsDTO,
  UpdateAppointmentStatusDTO,
  UploadTestResultsDTO,
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
