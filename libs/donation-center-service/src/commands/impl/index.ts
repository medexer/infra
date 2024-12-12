import {
  DonationCenterComplianceAddressDTO,
  DonationCenterComplianceDetailsDTO,
  DonationCenterComplianceCredentialsDTO,
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
